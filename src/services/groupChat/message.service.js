import messageRepository from "../../repositories/groupChat/message.repository.js";
import chatRepository from "../../repositories/groupChat/chat.repository.js";
import workspaceMemberRepository from "../../repositories/workspaceMember.repository.js";

class MessageService {

    async getMessages(chat_id) {

        const chat = await chatRepository.getById(chat_id);

        if (!chat) {
            throw new Error("El chat no existe.");
        }

        return await messageRepository.getAllByChat(chat_id);
    }

    async getMessageById(message_id) {

        const message = await messageRepository.getById(message_id);

        if (!message) {
            throw new Error("Mensaje no encontrado.");
        }

        return message;
    }

    async createMessage(chat_id, user_id, mensaje) {

        if (!mensaje || mensaje.trim() === "") {
            throw new Error("El mensaje no puede estar vacío.");
        }

        if (mensaje.length > 1000) {
            throw new Error("El mensaje supera el límite permitido.");
        }

        const chat = await chatRepository.getById(chat_id);

        if (!chat) {
            throw new Error("El chat no existe.");
        }

        const member =
            await workspaceMemberRepository.getMemberByWorkspaceAndUserId(
                chat.fk_workspace_id,
                user_id
            );

        if (!member) {
            throw new Error("No perteneces a este workspace.");
        }

        return await messageRepository.create(
            chat_id,
            user_id,
            mensaje.trim()
        );
    }

    async updateMessage(message_id, user_id, update_data) {

        const message = await messageRepository.getById(message_id);

        if (!message) {
            throw new Error("Mensaje no encontrado.");
        }

        if (message.fk_sender_user_id.toString() !== user_id.toString()) {
            throw new Error("No puedes editar mensajes de otro usuario.");
        }

        if (!update_data.mensaje || update_data.mensaje.trim() === "") {
            throw new Error("El mensaje no puede quedar vacío.");
        }

        update_data.mensaje = update_data.mensaje.trim();

        return await messageRepository.updateById(
            message_id,
            update_data
        );
    }

    async deleteMessage(message_id, user_id) {

        const message = await messageRepository.getById(message_id);

        if (!message) {
            throw new Error("Mensaje no encontrado.");
        }

        if (message.fk_sender_user_id.toString() !== user_id.toString()) {
            throw new Error("No puedes eliminar mensajes de otro usuario.");
        }

        await messageRepository.deleteById(message_id);
    }
}

const messageService = new MessageService();
export default messageService;