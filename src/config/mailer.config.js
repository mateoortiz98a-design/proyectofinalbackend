import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

const mailer_transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: ENVIRONMENT.GMAIL_USERNAME,
        pass: ENVIRONMENT.GMAIL_PASSWORD,
    },
});

export default mailer_transport