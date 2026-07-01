import chatService from "../../services/groupChat/chat.service.js";

class ChatController {

    async getAll(req, res, next) {
        try {
            const { workspace_id } = req.params;

            const chats = await chatService.getChatsByWorkspace(workspace_id);

            return res.status(200).json({
                ok: true,
                chats
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { chat_id } = req.params;

            const chat = await chatService.getChatById(chat_id);

            return res.status(200).json({
                ok: true,
                chat
            });

        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const { nombre } = req.body;

            const user_id = req.user.id;

            const chat = await chatService.createChat(
                workspace_id,
                user_id,
                nombre
            );

            return res.status(201).json({
                ok: true,
                message: "Chat creado correctamente.",
                chat
            });

        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { chat_id } = req.params;

            await chatService.deleteChat(chat_id);

            return res.status(200).json({
                ok: true,
                message: "Chat eliminado correctamente."
            });

        } catch (error) {
            next(error);
        }
    }
}

const chatController = new ChatController();
export default chatController; 