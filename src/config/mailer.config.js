import nodemailer from "nodemailer";
import ENVIRONMENT from "./environment.config.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,       // Tu Gmail
        pass: process.env.GMAIL_PASSWORD   // Tu contraseña de aplicación de 16 letras
    },
    // 💡 AGREGA ESTAS LÍNEAS PARA EVITAR EL ERROR DE RAILWAY:
    dnsUsingIpVersion: 4, // Fuerza a Node a resolver Gmail usando IPv4 en vez de IPv6
    connectionTimeout: 1000000, // Le da 10 segundos de margen para conectar
    tls: {
        rejectUnauthorized: false // Evita problemas con certificados SSL en contenedores
    }
});
export default transporter;