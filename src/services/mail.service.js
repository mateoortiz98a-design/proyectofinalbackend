import ENVIRONMENT from "../config/environment.config.js";

class MailService {
    /**
     * Método privado base para conectar con la API de Mailjet por HTTP POST (v3.1)
     */
    async _sendViaMailjetHttp(to, subject, htmlContent) {
        try {
            // Mailjet requiere autenticación Basic Auth combinando la API KEY y la SECRET KEY en Base64
            const authString = btoa(`${ENVIRONMENT.MAILJET_API_KEY}:${ENVIRONMENT.MAILJET_SECRET_KEY}`);

            const response = await fetch("https://api.mailjet.com/v3.1/send", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${authString}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Messages: [
                        {
                            From: {
                                Email: ENVIRONMENT.MAIL_FROM,
                                Name: "MiSlack"
                            },
                            To: [
                                {
                                    Email: to,
                                    Name: to.split('@')[0] // Nombre genérico basado en su mail
                                }
                            ],
                            Subject: subject,
                            HTMLPart: htmlContent
                        }
                    ]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Error Mailjet API: ${JSON.stringify(data)}`);
            }

            console.log(`[MailService] Correo enviado con Mailjet a ${to} con éxito.`);
            return data;
        } catch (error) {
            console.error("[MailService Error] Falló el envío por Mailjet HTTP:", error.message);
            // Re-lanzamos para que actúe el try/catch de emergencia del controlador si hiciera falta
            throw error;
        }
    }

    /**
     * Envía el correo de verificación de cuenta al registrarse
     */
    async sendVerificationEmail(email, token) {
        const verification_url = `https://proyectofinalfrontend-eight.vercel.app/verify?token=${token}`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #3f0e40; text-align: center;">¡Bienvenido a MiSlack!</h2>
                <p style="font-size: 16px; color: #333;">Gracias por registrarte. Por favor verificá tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verification_url}" style="background-color: #3f0e40; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                        Verificar mi cuenta
                    </a>
                </div>
                <p style="font-size: 12px; color: #777; text-align: center;">Si el botón no funciona, podés copiar y pegar este enlace en tu navegador:<br>${verification_url}</p>
            </div>
        `;
        
        return await this._sendViaMailjetHttp(email, "Verificá tu cuenta de MiSlack", html);
    }

    /**
     * Envía el correo para restablecer la contraseña
     */
    async sendResetPasswordEmail(email, token) {
        const reset_url = `https://proyectofinalfrontend-eight.vercel.app/reset-password?token=${token}`;
        
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3f0e40;">Restablecer contraseña</h2>
                <p>Hacé clic en el siguiente enlace para generar una nueva contraseña:</p>
                <p><a href="${reset_url}" style="color: #0056b3; font-weight: bold;">Restablecer Contraseña ➔</a></p>
            </div>
        `;
        
        return await this._sendViaMailjetHttp(email, "Restablecer contraseña - MiSlack", html);
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
                <p><a href="${accept_url}" style="color: #0056b3; font-weight: bold;">Ir a mis espacios de trabajo ➔</a></p>
            </div>
        `;
        
        return await this._sendViaMailjetHttp(invited_email, `Invitación a colaborar en ${workspace_name}`, html);
    }
}

const mailService = new MailService();
export default mailService;