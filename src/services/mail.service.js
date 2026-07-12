import nodemailer from 'nodemailer';
import ENVIRONMENT from "../config/environment.config.js";

// Configuración del transporte nativo para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENVIRONMENT.GMAIL_USERNAME,     // Tu cuenta de Gmail
    pass: ENVIRONMENT.GMAIL_PASSWORD  // Tu contraseña de aplicación de 16 letras
  }
});

class MailService {
    async sendVerificationEmail(email, verification_url) {
        try {
            await transporter.sendMail({
                from: `"MiSlack" <${ENVIRONMENT.GMAIL_USERNAME}>`, // ¡El remitente es tu cuenta de Gmail!
                to: email, // ¡Llegará al instante a CUALQUIER Gmail real de tus profes o compañeros!
                subject: 'Verifica tu mail',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>Bienvenido a MiSlack</h2>
                        <p>Hacé click en el siguiente link para verificar tu cuenta:</p>
                        <a href="${verification_url}" style="background-color: #3f0e40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar cuenta</a>
                        <p style="font-size: 12px; color: gray;">Si no te registraste, ignorá este mensaje.</p>
                    </div>
                `
            });
            console.log("Mail de verificación real enviado a:", email);
        } catch (error) {
            console.error("Error enviando con Gmail de Google:", error);
            throw error;
        }
    }

    async sendResetPasswordEmail(email, reset_url) {
        try {
            await transporter.sendMail({
                from: `"MiSlack" <${ENVIRONMENT.GMAIL_USERNAME}>`,
                to: email,
                subject: 'Restablecé tu contraseña',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>Restablecer contraseña</h2>
                        <p>Hacé click en el siguiente link para cambiar tu contraseña:</p>
                        <a href="${reset_url}" style="background-color: #3f0e40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer contraseña</a>
                    </div>
                `
            });
        } catch (error) { throw error; }
    }

    async sendInvitationMemberEmail(invited_email, accept_url, reject_url, role) {
        try {
            await transporter.sendMail({
                from: `"MiSlack" <${ENVIRONMENT.GMAIL_USERNAME}>`,
                to: invited_email,
                subject: 'Invitación a Espacio de Trabajo',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>¡Has sido invitado!</h2>
                        <p>Te invitaron con el rol de <b>${role}</b>.</p>
                        <div style="margin: 30px 0;">
                            <a href="${accept_url}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">ACEPTAR</a>
                            <a href="${reject_url}" style="background-color: #dc3545; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">RECHAZAR</a>
                        </div>
                    </div>
                `
            });
        } catch (error) { throw error; }
    }
}

const mailService = new MailService();
export default mailService;