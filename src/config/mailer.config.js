import nodemailer from "nodemailer";
import ENVIRONMENT from "./environment.config.js"; // Tu archivo de entorno actual

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS utiliza false para el puerto 587
  auth: {
    user: ENVIRONMENT.EMAIL_USER,      // El correo de tu cuenta de Brevo
    pass: ENVIRONMENT.BREVO_SMTP_KEY,  // La clave SMTP que generaste
  },
});

export default transporter;