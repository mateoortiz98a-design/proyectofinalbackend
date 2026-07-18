import ENVIRONMENT from "../config/environment.config.js";
import mailService from "../services/mail.service.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class AuthController {
    async register(req, res) {
        const { name, email, password } = req.body;

        if (!name || name.length <= 2) throw new ServerError("Nombre debe ser mayor a 2 caracteres", 400)
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new ServerError("Email inválido", 400)
        if (!password || password.length < 6) throw new ServerError("Password debe tener al menos 6 caracteres", 400)

        const existingUser = await userRepository.getByEmail(email);
        if (existingUser) throw new ServerError("El email ya está registrado", 400)

        const hashed_password = await bcrypt.hash(password, 12);
        const newUser = await userRepository.create(name, email, hashed_password);

        const verification_token = jwt.sign({ email }, ENVIRONMENT.JWT_SECRET)
        
        // 🚀 Construimos el link de emergencia apuntando a tu Frontend de Vercel
        const debugLink = `https://proyectofinalfrontend-eight.vercel.app/verify?token=${verification_token}`

        try {
            // Intentamos enviar el mail transaccional real usando Mailjet
            await mailService.sendVerificationEmail(email, verification_token)

            // 🚀 Modificado: Mandamos el debugLink siempre para poder saltearnos la espera de Gmail
            return res.status(201).json({
                message: "Usuario registrado con éxito",
                ok: true,
                status: 201,
                debugLink: debugLink, // 👈 Sumamos esto acá también temporalmente
                data: {
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email
                    }
                }
            });
        } catch (mailError) {
            console.error("[AuthRegister] Error al enviar el correo real, activando link de rescate:", mailError.message);
            
            return res.status(201).json({
                message: "Usuario registrado con éxito (Modo Demo)",
                ok: true,
                status: 201,
                debugLink: debugLink, 
                data: {
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email
                    }
                }
            });
        }
    }

    async verifyEmail(req, res) {
        try {
            const { verification_token } = req.query;
            if (!verification_token) throw new ServerError("Falta token de verificación", 400);

            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET)
            const { email } = payload
            const user = await userRepository.getByEmail(email);

            if (!user) throw new ServerError("Usuario no encontrado", 404);
            if (user.email_verificado) throw new ServerError("Este email ya ha sido verificado", 400);

            await userRepository.updateById(user._id, { email_verificado: true });

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Email verificado correctamente. ¡Ya puedes usar tu cuenta!"
            });
        } catch (error) {
            if (
                error instanceof jwt.JsonWebTokenError ||
                error instanceof jwt.NotBeforeError ||
                error instanceof jwt.TokenExpiredError
            ) {
                return res.status(401).json({ message: "Token invalido", ok: false, status: 401 })
            } else if (error instanceof ServerError) {
                return res.status(error.status).json({ message: error.message, ok: false, status: error.status })
            } else {
                console.error('Error critico:', error);
                return res.status(500).json({ message: "Error interno del servidor", ok: false, status: 500 });
            }
        }
    }

    async login(request, response) {
        const { email, password } = request.body

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new ServerError("Email inválido", 400)
        if (!password || password.length < 6) throw new ServerError("Contraseña invalida", 400)

        const user_found = await userRepository.getByEmail(email)
        if (!user_found) throw new ServerError("Usuario no registrado", 404)
        if (!user_found.email_verificado) throw new ServerError("Usuario con verificacion de mail pendiente", 401)

        const is_same_password = await bcrypt.compare(password, user_found.password)
        if (!is_same_password) throw new ServerError("Credenciales invalidas", 401)

        const profile_info = {
            name: user_found.name,
            email: user_found.email,
            id: user_found._id,
            fecha_creacion: user_found.fecha_creacion
        }

        const access_token = jwt.sign(profile_info, ENVIRONMENT.JWT_SECRET)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: 'Usuario autentificado exitosamente',
            data: { access_token }
        })
    }

    async resetPasswordRequest(request, response) {
        const { email } = request.body;
        if (!email) throw new ServerError("El email es obligatorio", 400);

        const user = await userRepository.getByEmail(email);
        if (!user) {
            return response.status(200).json({
                ok: true,
                status: 200,
                message: "En caso de que tengas una cuenta asociada a este correo te enviaremos instrucciones para restablecer tu contraseña"
            });
        }

        const secret_key = ENVIRONMENT.JWT_SECRET + user.password;
        const token = jwt.sign({ email: user.email, id: user._id }, secret_key, { expiresIn: '15m' });

        //  antes se armaba acá el link completo (${URL_FRONTEND}/reset-password?token=${token})
        // y se lo pasaba a sendResetPasswordEmail, que a su vez lo volvía a envolver en otra URL
        // completa (porque esa función espera el token PELADO, no un link armado). Eso generaba
        // el link duplicado que rompía el botón del mail. Ahora se le manda el token solo,
        // igual que ya se hace correctamente con sendVerificationEmail en register().
        await mailService.sendResetPasswordEmail(user.email, token)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: "En caso de que tengas una cuenta asociada a este correo te enviaremos instrucciones para restablecer tu contraseña"
        });
    }

    async resetPasswordConfirm(request, response) {
        const auth_header = request.headers.authorization
        if (!auth_header) throw new ServerError('Falta header de autentificacion', 401)

        const reset_token = auth_header.split(' ')[1]
        if (!reset_token) throw new ServerError('Falta el token de autorizacion', 401)

        //  si el token viene roto/no es un JWT válido, jwt.decode() devuelve null
        // en vez de tirar una excepción. Sin este chequeo, el "const { email } = null"
        // de la línea de abajo explotaba con un TypeError y tiraba 500 en vez de un error prolijo.
        const decoded = jwt.decode(reset_token)
        if (!decoded || !decoded.email) throw new ServerError('Token de restablecimiento inválido', 401)

        const { email } = decoded
        const user = await userRepository.getByEmail(email)
        if (!user) throw new ServerError("Usuario no encontrado", 404);

        const secret_key = ENVIRONMENT.JWT_SECRET + user.password;

        //  jwt.verify() con un token vencido o con firma inválida TIRA una excepción
        // (JsonWebTokenError / TokenExpiredError), así que también hay que envolverlo
        // para que caiga como error controlado (401) y no como 500.
        try {
            jwt.verify(reset_token, secret_key);
        } catch {
            throw new ServerError('El link de restablecimiento es inválido o ya expiró', 401)
        }

        const { newPassword } = request.body;
        if (!newPassword || newPassword.length < 6) throw new ServerError("Contraseña invalida", 400);

        const new_password_hashed = await bcrypt.hash(newPassword, 10);
        await userRepository.updateById(user._id, { password: new_password_hashed });

        return response.status(200).json({
            ok: true,
            status: 200,
            message: "Contraseña restablecida exitosamente"
        });
    }
}

const authController = new AuthController();
export default authController