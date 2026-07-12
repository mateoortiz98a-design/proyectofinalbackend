import fetch from "node-fetch";
import ENVIRONMENT from "../config/environment.config.js";

// mail.service.js

// 💡 Guardá tu API Key de Brevo en las variables de entorno de Render como BREVO_API_KEY
// Si querés probar rápido, podés pegar el string directo acá, pero recordá usar variables de entorno para producción.eo verificado en Brevo

class MailService {
    /**
     * Método privado base para conectar con la API de Brevo por HTTP POST
     */
    async _sendViaBrevoHttp(to, subject, htmlContent) {
        try {
            // Validamos que exista la API Key antes de enviar
            if (!ENVIRONMENT.BREVO_API_KEY || ENVIRONMENT.BREVO_API_KEY.includes("TU_API_KEY")) {
                throw new Error("La API Key de Brevo no está configurada correctamente en las variables de entorno.");
            }

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": ENVIRONMENT.BREVO_API_KEY,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    sender: { name: "MiSlack", email: ENVIRONMENT.MAIL_FROM },
                    to: [{ email: to }],
                    subject: subject,
                    htmlContent: htmlContent
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Error Brevo API: ${JSON.stringify(data)}`);
            }

            console.log(`[MailService] Correo enviado con éxito a ${to}. ID:`, data.messageId);
            return data;
        } catch (error) {
            console.error("[MailService Error] Falló el envío de correo por HTTP:", error.message);
            // Re-lanzamos el error para que lo atrape el catch de tu auth.controller
            throw error;
        }
    }

    /**
     * Envía el correo de verificación de cuenta al registrarse
     */
    async sendVerificationEmail(email, token) {
        // Apunta directo a tu frontend de Vercel
        const verification_url = `https://proyectofinalfrontend-eight.vercel.app/verify?token=${token}`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #3f0e40; text-align: center;">¡Bienvenido a MiSlack!</h2>
                <p style="font-size: 16px; color: #333;">Gracias por registrarte. Para completar la creación de tu cuenta y empezar a chatear con tu equipo, por favor verificá tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verification_url}" style="background-color: #3f0e40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                        Verificar mi cuenta
                    </a>
                </div>
                <p style="font-size: 12px; color: #777; text-align: center;">Si el botón no funciona, podés copiar y pegar este enlace en tu navegador:<br>${verification_url}</p>
            </div>
        `;
        
        return await this._sendViaBrevoHttp(email, "Verificá tu cuenta de MiSlack", html);
    }

    /**
     * Envía el correo para restablecer la contraseña
     */
    async sendResetPasswordEmail(email, token) {
        const reset_url = `https://proyectofinalfrontend-eight.vercel.app/reset-password?token=${token}`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3f0e40;">Restablecer contraseña</h2>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta de MiSlack.</p>
                <p>Hacé clic en el siguiente enlace para generar una nueva contraseña:</p>
                <p><a href="${reset_url}" style="color: #0056b3; font-weight: bold;">Restablecer Contraseña ➔</a></p>
                <p style="font-size: 12px; color: #777;">Si no solicitaste este cambio, podés ignorar este correo de forma segura.</p>
            </div>
        `;
        
        return await this._sendViaBrevoHttp(email, "Restablecer contraseña - MiSlack", html);
    }

    /**
     * Envía una invitación para unirse a un espacio de trabajo
     */
    async sendInvitationMemberEmail(invited_email, workspace_name, role) {
        const accept_url = `https://proyectofinalfrontend-eight.vercel.app/workspaces`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3f0e40;">Te invitaron a colaborar</h2>
                <p>Has sido invitado a unirte al espacio de trabajo <strong>${workspace_name}</strong> con el rol de <strong>${role}</strong>.</p>
                <p>Iniciá sesión en la plataforma para ver y aceptar tus invitaciones pendientes:</p>
                <p><a href="${accept_url}" style="color: #0056b3; font-weight: bold;">Ir a mis espacios de trabajo ➔</a></p>
            </div>
        `;
        
        return await this._sendViaBrevoHttp(invited_email, `Invitación a colaborar en ${workspace_name}`, html);
    }
}

const mailService = new MailService();
export default mailService;