import nodemailer from 'nodemailer'
import ENVIRONMENT from "../config/environment.config.js";
import ServerError from "../helpers/serverError.helper.js";

// Configuración del transporte de Nodemailer conectado a Brevo
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // TLS utiliza false para el puerto 587
    auth: {
        user: ENVIRONMENT.EMAIL_USER,     // Tu correo de registro en Brevo
        pass: ENVIRONMENT.BREVO_SMTP_KEY  // Tu clave maestra SMTP de Brevo
    },
});

class MailService {

    async sendVerificationEmail(email, verification_url) {
        try {
            await transporter.sendMail({
                from: `"MiSlack" <${ENVIRONMENT.EMAIL_USER}>`,
                to: email,
                subject: 'Verifica tu mail',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>Bienvenido a MiSlack</h2>
                        <p>Hacé click en el siguiente link para verificar tu cuenta:</p>
                        <a href="${verification_url}" style="background-color: #3f0e40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar cuenta</a>
                        <p style="font-size: 12px; color: gray;">Si no te registraste, ignorá este mensaje.</p>
                    </div>
                `
            })
            console.log("Mail de verificación enviado con Brevo a:", email)
        } catch (error) {
            console.error("Error al enviar verificación con Brevo:", error)
            throw error
        }
    }

    async sendResetPasswordEmail(email, reset_url) {
        try {
            await transporter.sendMail({
                from: `"MiSlack" <${ENVIRONMENT.EMAIL_USER}>`,
                to: email,
                subject: 'Restablecé tu contraseña',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>Restablecer contraseña</h2>
                        <p>Hacé click en el siguiente link para restablecer tu contraseña:</p>
                        <a href="${reset_url}" style="background-color: #3f0e40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer contraseña</a>
                        <p style="font-size: 12px; color: gray;">Este link expira en 15 minutos.</p>
                    </div>
                `
            })
            console.log("Mail de reset enviado con Brevo a:", email)
        } catch (error) {
            console.error("Error al enviar reset con Brevo:", error)
            throw error
        }
    }

    async sendInvitationMemberEmail(invited_email, accept_url, reject_url, role) {
        try {
            await transporter.sendMail({
                from: `"MiSlack" <${ENVIRONMENT.EMAIL_USER}>`,
                to: invited_email,
                subject: 'Invitación a Espacio de Trabajo',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>¡Has sido invitado!</h2>
                        <p>Alguien te ha invitado a colaborar en un espacio de trabajo con el rol de <b>${role}</b>.</p>
                        <div style="margin: 30px 0;">
                            <a href="${accept_url}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">ACEPTAR</a>
                            <a href="${reject_url}" style="background-color: #dc3545; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">RECHAZAR</a>
                        </div>
                        <p style="font-size: 12px; color: gray;">Si no conoces este espacio, ignorá este mensaje.</p>
                    </div>
                `
            })
            console.log("Mail de invitación enviado con Brevo a:", invited_email)
        } catch (error) {
            console.error("Error al enviar invitación con Brevo:", error)
            throw error
        }
    }
}

const mailService = new MailService()
export default mailService