import privateChatRepository from "../../repositories/privateChat/privateChat.repository.js";
import userRepository from "../../repositories/user.repository.js";

class PrivateChatService {

    async getChat(chat_id) {

        const chat = await privateChatRepository.getById(chat_id);

        if (!chat) {
            throw new Error("Chat privado no encontrado.");
        }

        return chat;
    }

    async getMyChats(user_id) {

        return await privateChatRepository.getChatsByUser(user_id);

    }

    async createChat(user_id, user_id2) {

        if (user_id.toString() === user_id2.toString()) {
            throw new Error("No puedes crear un chat contigo mismo.");
        }

        const user = await userRepository.getById(user_id);

        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        const otherUser = await userRepository.getById(user_id2);

        if (!otherUser) {
            throw new Error("El usuario destino no existe.");
        }

        const existingChat =
            await privateChatRepository.getChatBetweenUsers(
                user_id,
                user_id2
            );

        if (existingChat) {
            return existingChat;
        }

        return await privateChatRepository.create(
            user_id,
            user_id2
        );
    }

    async deleteChat(chat_id, user_id) {

        const chat =
            await privateChatRepository.getById(chat_id);

        if (!chat) {
            throw new Error("Chat no encontrado.");
        }

        const isParticipant =
            chat.fk_user_id._id.toString() === user_id.toString() ||
            chat.fk_user_id2._id.toString() === user_id.toString();

        if (!isParticipant) {
            throw new Error("No tienes permisos para eliminar este chat.");
        }

        await privateChatRepository.deleteById(chat_id);

    }

}

const privateChatService = new PrivateChatService();

export default privateChatService;
