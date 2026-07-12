import ENVIRONMENT from "../config/environment.config.js";
import ServerError from "../helpers/serverError.helper.js";

class MailService {
    // Función interna auxiliar para hacer la petición HTTP a Brevo
    async _sendViaHttp(toEmail, subject, htmlContent) {
        try {
            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": ENVIRONMENT.BREVO_SMTP_KEY, // Aquí va tu misma clave larga de Brevo
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    sender: { 
                        name: "MiSlack", 
                        email: ENVIRONMENT.EMAIL_USER // Tu correo de Brevo
                    },
                    to: [{ email: toEmail }],
                    subject: subject,
                    htmlContent: htmlContent
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error en la API HTTP de Brevo:", error);
            throw error;
        }
    }

    async sendVerificationEmail(email, verification_url) {
        try {
            const html = `
                <div style="font-family: Arial; padding: 20px; text-align: center;">
                    <h2>Bienvenido a MiSlack</h2>
                    <p>Hacé click en el siguiente link para verificar tu cuenta:</p>
                    <a href="${verification_url}" style="background-color: #3f0e40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar cuenta</a>
                    <p style="font-size: 12px; color: gray;">Si no te registraste, ignorá este mensaje.</p>
                </div>
            `;
            await this._sendViaHttp(email, 'Verifica tu mail', html);
            console.log("Mail de verificación enviado vía HTTP a:", email);
        } catch (error) {
            console.error("Error al enviar verificación:", error);
            throw error;
        }
    }

    async sendResetPasswordEmail(email, reset_url) {
        try {
            const html = `
                <div style="font-family: Arial; padding: 20px; text-align: center;">
                    <h2>Restablecer contraseña</h2>
                    <p>Hacé click en el siguiente link para restablecer tu contraseña:</p>
                    <a href="${reset_url}" style="background-color: #3f0e40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer contraseña</a>
                    <p style="font-size: 12px; color: gray;">Este link expira en 15 minutos.</p>
                </div>
            `;
            await this._sendViaHttp(email, 'Restablecé tu contraseña', html);
            console.log("Mail de reset enviado vía HTTP a:", email);
        } catch (error) {
            console.error("Error al enviar reset:", error);
            throw error;
        }
    }

    async sendInvitationMemberEmail(invited_email, accept_url, reject_url, role) {
        try {
            const html = `
                <div style="font-family: Arial; padding: 20px; text-align: center;">
                    <h2>¡Has sido invitado!</h2>
                    <p>Alguien te ha invitado a colaborar en un espacio de trabajo con el rol de <b>${role}</b>.</p>
                    <div style="margin: 30px 0;">
                        <a href="${accept_url}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">ACEPTAR</a>
                        <a href="${reject_url}" style="background-color: #dc3545; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">RECHAZAR</a>
                    </div>
                    <p style="font-size: 12px; color: gray;">Si no conoces este espacio, ignorá este mensaje.</p>
                </div>
            `;
            await this._sendViaHttp(invited_email, 'Invitación a Espacio de Trabajo', html);
            console.log("Mail de invitación enviado vía HTTP a:", invited_email);
        } catch (error) {
            console.error("Error al enviar invitación:", error);
            throw error;
        }
    }
}

const mailService = new MailService();
export default mailService;