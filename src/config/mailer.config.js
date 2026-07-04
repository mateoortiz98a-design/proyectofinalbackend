import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

console.log("GMAIL_USERNAME:", ENVIRONMENT.GMAIL_USERNAME)
console.log("GMAIL_PASSWORD:", ENVIRONMENT.GMAIL_PASSWORD ? "OK" : "NO CARGADA")

const mailer_transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: ENVIRONMENT.GMAIL_USERNAME,
        pass: ENVIRONMENT.GMAIL_PASSWORD
    }
})

mailer_transport.verify((error, success) => {
    if (error) {
        console.error("SMTP ERROR:", error)
    } else {
        console.log("SMTP OK")
    }
})

export default mailer_transport