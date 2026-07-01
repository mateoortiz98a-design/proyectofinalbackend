import contactService from "../services/contact.service.js";

class ContactController {

    async sendRequest(request, response) {
        const { id: sender_id } = request.user
        const { email } = request.body

        await contactService.sendRequest(sender_id, email)

        return response.status(201).json({
            ok: true,
            message: "Solicitud de contacto enviada"
        })
    }

    async respondRequest(request, response) {
        const { id: user_id } = request.user
        const { contact_id } = request.params
        const { decision } = request.body

        await contactService.respondRequest(contact_id, user_id, decision)

        return response.status(200).json({
            ok: true,
            message: `Solicitud ${decision.toLowerCase()} correctamente`
        })
    }

    async getContacts(request, response) {
        const { id: user_id } = request.user

        const contacts = await contactService.getContacts(user_id)

        return response.status(200).json({
            ok: true,
            data: { contacts }
        })
    }

    async getPendingRequests(request, response) {
        const { id: user_id } = request.user

        const requests = await contactService.getPendingRequests(user_id)

        return response.status(200).json({
            ok: true,
            data: { requests }
        })
    }

    async deleteContact(request, response) {
        const { id: user_id } = request.user
        const { contact_id } = request.params

        await contactService.deleteContact(contact_id, user_id)

        return response.status(200).json({
            ok: true,
            message: "Contacto eliminado correctamente"
        })
    }
}

const contactController = new ContactController()
export default contactController