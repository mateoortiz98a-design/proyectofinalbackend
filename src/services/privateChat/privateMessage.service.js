import privateMessageRepository from "../../repositories/privateChat/privateMessage.repository.js";
import privateChatRepository from "../../repositories/privateChat/privateChat.repository.js";

class PrivateMessageService {

    async getMessages(chat_id, user_id) {
        const chat = await privateChatRepository.getById(chat_id);
        if (!chat) throw new Error("Chat privado no encontrado.");

        const isParticipant =
            chat.fk_user_id._id.toString() === user_id.toString() ||
            chat.fk_user_id2._id.toString() === user_id.toString();
        if (!isParticipant) throw new Error("No tienes acceso a esta conversación.");

        return await privateMessageRepository.getAllByChat(chat_id);
    }

    async getMessageById(message_id) {
        const message = await privateMessageRepository.getById(message_id);
        if (!message) throw new Error("Mensaje no encontrado.");
        return message;
    }

    async createMessage(chat_id, sender_id, mensaje) {
        if (!mensaje || mensaje.trim() === "") throw new Error("El mensaje no puede estar vacío.");
        if (mensaje.length > 1000) throw new Error("El mensaje supera el límite permitido.");

        const chat = await privateChatRepository.getById(chat_id);
        if (!chat) throw new Error("El chat no existe.");

        const isParticipant =
            chat.fk_user_id._id.toString() === sender_id.toString() ||
            chat.fk_user_id2._id.toString() === sender_id.toString();
        if (!isParticipant) throw new Error("No perteneces a esta conversación.");

        return await privateMessageRepository.create(chat_id, sender_id, mensaje.trim());
    }

    async updateMessage(message_id, sender_id, update_data) {
        const message = await privateMessageRepository.getById(message_id);
        if (!message) throw new Error("Mensaje no encontrado.");

        if (message.fk_sender_user_id._id.toString() !== sender_id.toString()) {
            throw new Error("Solo puedes editar tus mensajes.");
        }
        if (!update_data.mensaje || update_data.mensaje.trim() === "") {
            throw new Error("El mensaje no puede quedar vacío.");
        }
        update_data.mensaje = update_data.mensaje.trim();
        return await privateMessageRepository.updateById(message_id, update_data);
    }

    async deleteMessage(message_id, sender_id) {
        const message = await privateMessageRepository.getById(message_id);
        if (!message) throw new Error("Mensaje no encontrado.");

        if (message.fk_sender_user_id._id.toString() !== sender_id.toString()) {
            throw new Error("Solo puedes eliminar tus mensajes.");
        }

        await privateMessageRepository.deleteById(message_id);
        return message // ✅ retornar para usar fk_private_chat_id en el controller
    }
}

const privateMessageService = new PrivateMessageService();
export default privateMessageService;