import ServerError from "../helpers/serverError.helper.js";
import contactRepository from "../repositories/contact.repository.js";
import userRepository from "../repositories/user.repository.js";

class ContactService {

    async sendRequest(sender_id, receiver_email) {
        const receiver = await userRepository.getByEmail(receiver_email)
        if (!receiver) {
            throw new ServerError("Usuario no encontrado", 404)
        }

        if (sender_id.toString() === receiver._id.toString()) {
            throw new ServerError("No podés enviarte una solicitud a vos mismo", 400)
        }

        const existing = await contactRepository.getBySenderAndReceiver(sender_id, receiver._id)
        if (existing) {
            if (existing.status === 'ACEPTADO') {
                throw new ServerError("Ya son contactos", 400)
            }
            if (existing.status === 'PENDIENTE') {
                throw new ServerError("Ya enviaste una solicitud a este usuario", 400)
            }
        }

        return await contactRepository.create(sender_id, receiver._id)
    }

    async respondRequest(contact_id, user_id, decision) {
        const contact = await contactRepository.getById(contact_id)
        if (!contact) {
            throw new ServerError("Solicitud no encontrada", 404)
        }

        if (contact.fk_receiver_id.toString() !== user_id.toString()) {
            throw new ServerError("No tenés permiso para responder esta solicitud", 403)
        }

        if (contact.status !== 'PENDIENTE') {
            throw new ServerError("Esta solicitud ya fue procesada", 400)
        }

        if (decision !== 'ACEPTADO' && decision !== 'RECHAZADO') {
            throw new ServerError("Decisión inválida", 400)
        }

        return await contactRepository.updateById(contact_id, { status: decision })
    }

    async getContacts(user_id) {
        return await contactRepository.getContactsByUser(user_id)
    }

    async getPendingRequests(user_id) {
        return await contactRepository.getPendingByReceiver(user_id)
    }

    async deleteContact(contact_id, user_id) {
        const contact = await contactRepository.getById(contact_id)
        if (!contact) {
            throw new ServerError("Contacto no encontrado", 404)
        }

        const isOwner = contact.fk_sender_id.toString() === user_id.toString() ||
                        contact.fk_receiver_id.toString() === user_id.toString()

        if (!isOwner) {
            throw new ServerError("No tenés permiso para eliminar este contacto", 403)
        }

        await contactRepository.deleteById(contact_id)
    }
}

const contactService = new ContactService()
export default contactService