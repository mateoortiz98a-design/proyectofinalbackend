// Asegurate de pasarle tu API Key por variable de entorno o pegarla acá para probar
const BREVO_API_KEY = process.env.BREVO_API_KEY || "TU_API_KEY_DE_BREVO_AQUÍ"; 

export const sendVerificationEmail = async (emailDestino, token) => {
    const verification_url = `https://proyectofinalfrontend-eight.vercel.app/verify?token=${token}`;

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                // 🔥 IMPORTANTE: El email del sender tiene que ser el tuyo verificado
                sender: { name: "MiSlack", email: "mateoortiz98a@gmail.com" }, 
                to: [{ email: emailDestino }],
                subject: "Verificá tu cuenta de MiSlack",
                htmlContent: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>¡Bienvenido a MiSlack!</h2>
                        <p>Hacé clic en el siguiente enlace para activar tu cuenta:</p>
                        <a href="${verification_url}" style="background-color: #3f0e40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            Verificar Cuenta
                        </a>
                    </div>
                `
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error en la API de Brevo: ${JSON.stringify(data)}`);
        }

        console.log("¡Mail enviado con éxito mediante la API de Brevo!", data.messageId);
        return data;

    } catch (error) {
        console.error("Error crítico enviando el correo por HTTP:", error);
        throw error;
    }
};