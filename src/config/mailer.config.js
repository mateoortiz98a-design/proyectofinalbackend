import nodemailer from "nodemailer";
import ENVIRONMENT from "./environment.config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENVIRONMENT.GMAIL_USERNAME,       // Tu correo de Gmail (ej: tu_usuario@gmail.com)
    pass: ENVIRONMENT.GMAIL_PASSWORD,   // La contraseña de 16 letras que te da Google
  },
});

export default transporter;