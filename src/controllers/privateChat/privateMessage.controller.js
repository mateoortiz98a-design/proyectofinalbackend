import privateMessageService from "../../services/privateChat/privateMessage.service.js";
import {getIO}from "../../config/socket.config.js";

class PrivateMessageController {

    async getAll(req, res, next) {
        try {
            const messages = await privateMessageService.getMessages(
                req.params.chat_id,
                req.user.id
            );
            return res.status(200).json({ ok: true, messages });
        } catch (error) { next(error) }
    }

    async getById(req, res, next) {
        try {
            const message = await privateMessageService.getMessageById(req.params.message_id);
            return res.status(200).json({ ok: true, message });
        } catch (error) { next(error) }
    }

   async create(req, res, next) {
    try {
        const { chat_id } = req.params;
        const user_id = req.user.id;
        const { mensaje } = req.body;

        const message = await privateMessageService.createMessage(chat_id, user_id, mensaje);

        // Populate antes de emitir
        await message.populate('fk_sender_user_id', 'name email')

        const io = getIO()
        io.to(`private_chat:${chat_id}`).emit('new_private_message', message)

        return res.status(201).json({ ok: true, message: "Mensaje enviado.", data: message });
    } catch (error) { next(error) }
}
    async update(req, res, next) {
        try {
            const { message_id } = req.params;
            const user_id = req.user.id;

            const message = await privateMessageService.updateMessage(message_id, user_id, req.body);

            getIO().to(`private_chat:${message.fk_chat_id}`).emit('updated_private_message', message)

            return res.status(200).json({ ok: true, message: "Mensaje actualizado.", data: message });
        } catch (error) { next(error) }
    }

    async delete(req, res, next) {
        try {
            const { message_id } = req.params;
            const user_id = req.user.id;

            const deletedMessage = await privateMessageService.deleteMessage(message_id, user_id);

            getIO().to(`private_chat:${deletedMessage.fk_chat_id}`).emit('deleted_private_message', { message_id })

            return res.status(200).json({ ok: true, message: "Mensaje eliminado." });
        } catch (error) { next(error) }
    }
}

const privateMessageController = new PrivateMessageController();
export default privateMessageController;