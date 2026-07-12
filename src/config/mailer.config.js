import nodemailer from "nodemailer";
import ENVIRONMENT from "./environment.config.js";

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false,
  auth: {
    user: ENVIRONMENT.MAILJET_API_KEY,
    pass: ENVIRONMENT.MAILJET_SECRET_KEY,
  },
});

export default transporter;