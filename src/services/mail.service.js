import { Resend } from 'resend'
import ENVIRONMENT from "../config/environment.config.js";
import ServerError from "../helpers/serverError.helper.js";

const resend = new Resend(ENVIRONMENT.RESEND_API_KEY)

class MailService {

    async sendVerificationEmail(email, verification_url) {
        try {
            await resend.emails.send({
                from: 'MiSlack <onboarding@resend.dev>',
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
            console.log("Mail de verificación enviado a:", email)
        } catch (error) {
            console.error("Error al enviar verificación:", error)
            throw error
        }
    }

    async sendResetPasswordEmail(email, reset_url) {
        try {
            await resend.emails.send({
                from: 'MiSlack <onboarding@resend.dev>',
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
            console.log("Mail de reset enviado a:", email)
        } catch (error) {
            console.error("Error al enviar reset:", error)
            throw error
        }
    }

    async sendInvitationMemberEmail(invited_email, accept_url, reject_url, role) {
        try {
            await resend.emails.send({
                from: 'MiSlack <onboarding@resend.dev>',
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
            console.log("Mail de invitación enviado a:", invited_email)
        } catch (error) {
            console.error("Error al enviar invitación:", error)
            throw error
        }
    }
}

const mailService = new MailService()
export default mailService