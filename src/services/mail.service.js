import transporter from "../config/mailer.config.js";
import ENVIRONMENT from "../config/environment.config.js";

class MailService {
    async _sendMail(to, subject, html) {
        await transporter.sendMail({
            from: `"MiSlack" <${ENVIRONMENT.EMAIL_USER}>`,
            to,
            subject,
            html
        });
    }

    async sendVerificationEmail(email, verification_url) {
        const html = `
            <div style="font-family:Arial;padding:20px;text-align:center">
                <h2>Bienvenido a MiSlack</h2>
                <p>Hacé click para verificar tu cuenta.</p>
                <a href="${verification_url}">Verificar cuenta</a>
            </div>
        `;

        await this._sendMail(email, "Verificá tu mail", html);
    }

    async sendResetPasswordEmail(email, reset_url) {
        const html = `
            <div style="font-family:Arial;padding:20px;text-align:center">
                <h2>Restablecer contraseña</h2>
                <a href="${reset_url}">Restablecer contraseña</a>
            </div>
        `;

        await this._sendMail(email, "Restablecé tu contraseña", html);
    }

    async sendInvitationMemberEmail(email, accept_url, reject_url, role) {
        const html = `
            <div style="font-family:Arial;padding:20px;text-align:center">
                <h2>Invitación</h2>

                <p>Rol: <b>${role}</b></p>

                <a href="${accept_url}">Aceptar</a>
                <br><br>
                <a href="${reject_url}">Rechazar</a>
            </div>
        `;

        await this._sendMail(email, "Invitación", html);
    }
}

export default new MailService();