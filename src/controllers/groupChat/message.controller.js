import messageService from "../../services/groupChat/message.service.js";

class MessageController {

    async getAll(req, res, next) {
        try {
            const { chat_id } = req.params;

            const messages = await messageService.getMessages(chat_id);

            return res.status(200).json({
                ok: true,
                messages
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { message_id } = req.params;

            const message = await messageService.getMessageById(message_id);

            return res.status(200).json({
                ok: true,
                message
            });

        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { chat_id } = req.params;
            const { mensaje } = req.body;

            const user_id = req.user.id;

            const newMessage = await messageService.createMessage(
                chat_id,
                user_id,
                mensaje
            );

            return res.status(201).json({
                ok: true,
                message: "Mensaje enviado correctamente.",
                data: newMessage
            });

        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { message_id } = req.params;

            const user_id = req.user.id;

            const updatedMessage =
                await messageService.updateMessage(
                    message_id,
                    user_id,
                    req.body
                );

            return res.status(200).json({
                ok: true,
                message: "Mensaje actualizado correctamente.",
                data: updatedMessage
            });

        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { message_id } = req.params;

            const user_id = req.user.id;

            await messageService.deleteMessage(
                message_id,
                user_id
            );

            return res.status(200).json({
                ok: true,
                message: "Mensaje eliminado correctamente."
            });

        } catch (error) {
            next(error);
        }
    }
}

const messageController = new MessageController();
export default messageController;