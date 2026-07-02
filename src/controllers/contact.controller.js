import contactService from "../services/contact.service.js";
import { getIO } from "../config/socket.config.js"; //import getIO from "../config/socket.config.js";

class ContactController {

    async sendRequest(request, response) {
        const { id: sender_id } = request.user
        const { email } = request.body

        const contact = await contactService.sendRequest(sender_id, email)

        // Notificar al receptor
        getIO().to(`user:${contact.fk_receiver_id}`).emit('new_contact_request', contact)

        return response.status(201).json({ ok: true, message: "Solicitud de contacto enviada" })
    }

    async respondRequest(request, response) {
        const { id: user_id } = request.user
        const { contact_id } = request.params
        const { decision } = request.body

        const contact = await contactService.respondRequest(contact_id, user_id, decision)

        // Notificar al que envió la solicitud
        getIO().to(`user:${contact.fk_sender_id}`).emit('contact_request_response', contact)

        return response.status(200).json({ ok: true, message: `Solicitud ${decision.toLowerCase()} correctamente` })
    }

    async getContacts(request, response) {
        const { id: user_id } = request.user
        const contacts = await contactService.getContacts(user_id)
        return response.status(200).json({ ok: true, data: { contacts } })
    }

    async getPendingRequests(request, response) {
        const { id: user_id } = request.user
        const requests = await contactService.getPendingRequests(user_id)
        return response.status(200).json({ ok: true, data: { requests } })
    }

    async deleteContact(request, response) {
        const { id: user_id } = request.user
        const { contact_id } = request.params
        await contactService.deleteContact(contact_id, user_id)
        return response.status(200).json({ ok: true, message: "Contacto eliminado correctamente" })
    }
}

const contactController = new ContactController()
export default contactController