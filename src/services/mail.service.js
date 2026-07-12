import ENVIRONMENT from "../config/environment.config.js";

class MailService {
    async _sendViaHttp(toEmail, subject, htmlContent) {
        try {
            const credentials = Buffer.from(
                `${ENVIRONMENT.MAILJET_API_KEY}:${ENVIRONMENT.MAILJET_SECRET_KEY}`
            ).toString("base64");

            const response = await fetch(
                "https://api.mailjet.com/v3.1/send",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${credentials}`,
                    },
                    body: JSON.stringify({
                        Messages: [
                            {
                                From: {
                                    Email: ENVIRONMENT.MAIL_FROM,
                                    Name: "MiSlack",
                                },
                                To: [
                                    {
                                        Email: toEmail,
                                    },
                                ],
                                Subject: subject,
                                HTMLPart: htmlContent,
                            },
                        ],
                    }),
                }
            );

           const data = await response.json();

console.log(
    JSON.stringify(data.Messages[0].Errors, null, 2)
);

if (!response.ok) {
    throw new Error(
        JSON.stringify(data.Messages[0].Errors, null, 2)
    );
}
            return data;
        } catch (error) {
            console.error("Mailjet:", error);
            throw error;
        }
    }

    async sendVerificationEmail(email, verification_url) {
        const html = `
            <div style="font-family:Arial;padding:20px;text-align:center;">
                <h2>Bienvenido a MiSlack</h2>
                <p>Hacé click para verificar tu cuenta.</p>

                <a
                    href="${verification_url}"
                    style="background:#3f0e40;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;"
                >
                    Verificar cuenta
                </a>
            </div>
        `;

        return this._sendViaHttp(email, "Verificá tu cuenta", html);
    }

    async sendResetPasswordEmail(email, reset_url) {
        const html = `
            <div style="font-family:Arial;padding:20px;text-align:center;">
                <h2>Restablecer contraseña</h2>

                <a
                    href="${reset_url}"
                    style="background:#3f0e40;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;"
                >
                    Restablecer contraseña
                </a>
            </div>
        `;

        return this._sendViaHttp(email, "Restablecer contraseña", html);
    }

    async sendInvitationMemberEmail(email, accept_url, reject_url, role) {
        const html = `
            <div style="font-family:Arial;padding:20px;text-align:center;">
                <h2>Invitación</h2>

                <p>Has sido invitado como <b>${role}</b>.</p>

                <a href="${accept_url}">Aceptar</a>

                <br><br>

                <a href="${reject_url}">Rechazar</a>
            </div>
        `;

        return this._sendViaHttp(
            email,
            "Invitación a Workspace",
            html
        );
    }
}

export default new MailService();