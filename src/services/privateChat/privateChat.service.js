import privateChatRepository from "../../repositories/privateChat/privateChat.repository.js";
import userRepository from "../../repositories/user.repository.js";
import ServerError from "../../helpers/serverError.helper.js";

class PrivateChatService {

    async getChat(chat_id) {

        const chat = await privateChatRepository.getById(chat_id);

        if (!chat) {
            throw new ServerError("Chat privado no encontrado.", 404);
        }

        return chat;
    }

    async getMyChats(user_id) {

        return await privateChatRepository.getChatsByUser(user_id);

    }

    async createChat(user_id, user_id2) {

        if (user_id.toString() === user_id2.toString()) {
            throw new ServerError("No puedes crear un chat contigo mismo.", 400);
        }

        const user = await userRepository.getById(user_id);

        if (!user) {
            throw new ServerError("Usuario no encontrado.", 404);
        }

        const otherUser = await userRepository.getById(user_id2);

        if (!otherUser) {
            throw new ServerError("El usuario destino no existe.", 404);
        }

        const existingChat =
            await privateChatRepository.getChatBetweenUsers(
                user_id,
                user_id2
            );

        if (existingChat) {

            // Si el usuario lo había "eliminado" de su lado, lo restauramos
            // para que vuelva a verlo, en vez de crear un chat duplicado vacío.
            const yaLoHabiaBorrado = existingChat.deleted_by?.some(
                id => id.toString() === user_id.toString()
            );

            if (yaLoHabiaBorrado) {
                await privateChatRepository.unmarkDeletedByUserForChat(existingChat._id, user_id);
            }

            // Devolvemos siempre la versión POBLADA (con name/email), nunca el crudo.
            return await privateChatRepository.getById(existingChat._id);
        }

        const created = await privateChatRepository.create(user_id, user_id2);

        // Igual acá: devolvemos poblado para que el frontend tenga el nombre desde el primer momento.
        return await privateChatRepository.getById(created._id);
    }

    async deleteChat(chat_id, user_id) {

        const chat =
            await privateChatRepository.getById(chat_id);

        if (!chat) {
            throw new ServerError("Chat no encontrado.", 404);
        }

        // si el otro participante borró su cuenta, Mongoose popula ese campo
        // como null (no tira error). Sin el "?." acá, chat.fk_user_id2._id explotaba
        // con un TypeError apenas alguien intentaba borrar/salir de un chat con una
        // cuenta eliminada del otro lado, tirando 500. Con optional chaining, si el
        // campo es null simplemente esa comparación da "false" y sigue de largo.
        const isParticipant =
            chat.fk_user_id?._id?.toString() === user_id.toString() ||
            chat.fk_user_id2?._id?.toString() === user_id.toString();

        if (!isParticipant) {
            throw new ServerError("No tienes permisos para eliminar este chat.", 403);
        }

        // Borrado lógico: solo se oculta para quien lo borra, la conversación sigue
        // intacta (con todos sus mensajes) para el otro participante, si sigue existiendo.
        await privateChatRepository.markDeletedByUserForChat(chat_id, user_id);

    }

}

const privateChatService = new PrivateChatService();

export default privateChatService;