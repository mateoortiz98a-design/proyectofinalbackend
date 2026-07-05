import messageService from "../../services/groupChat/message.service.js";
import { getIO } from "../../config/socket.config.js";

class MessageController {

    async getAll(req, res, next) {
        try {
            const { chat_id } = req.params;
            const messages = await messageService.getMessages(chat_id);
            return res.status(200).json({ ok: true, messages });
        } catch (error) { next(error) }
    }

    async getById(req, res, next) {
        try {
            const { message_id } = req.params;
            const message = await messageService.getMessageById(message_id);
            return res.status(200).json({ ok: true, message });
        } catch (error) { next(error) }
    }

    async create(req, res, next) {
        try {
            const { chat_id } = req.params;
            const { mensaje } = req.body;
            const user_id = req.user.id;

            const newMessage = await messageService.createMessage(chat_id, user_id, mensaje);
            await newMessage.populate('fk_sender_user_id', 'name email')

            const io = getIO()
            io.to(`chat:${chat_id}`).emit('new_message', newMessage)

            return res.status(201).json({ ok: true, message: "Mensaje enviado.", data: newMessage });
        } catch (error) { next(error) }
    }

    async update(req, res, next) {
        try {
            const { message_id } = req.params;
            const user_id = req.user.id;
            const updatedMessage = await messageService.updateMessage(message_id, user_id, req.body);

            getIO().to(`chat:${updatedMessage.fk_chat_id}`).emit('updated_message', updatedMessage)

            return res.status(200).json({ ok: true, message: "Mensaje actualizado.", data: updatedMessage });
        } catch (error) { next(error) }
    }

    async delete(req, res, next) {
        try {
            const { message_id } = req.params;
            const user_id = req.user.id;

            const deletedMessage = await messageService.deleteMessage(message_id, user_id);

            getIO().to(`chat:${deletedMessage.fk_chat_id}`).emit('deleted_message', { message_id })

            return res.status(200).json({ ok: true, message: "Mensaje eliminado." });
        } catch (error) { next(error) }
    }
}

const messageController = new MessageController();
export default messageController;