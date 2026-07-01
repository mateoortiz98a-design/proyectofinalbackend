import messageModel from '../../models/groupChat/message.model.js';

class MessageRepository {


    async getAllByChat(chat_id) {
        return await messageModel
            .find({ fk_chat_id: chat_id })
            .sort({ fecha_creacion: 1 });
    }

    async getById(message_id) {
        return await messageModel.findById(message_id);
    }
    async create(fk_chat_id, fk_sender_user_id, mensaje) {
        return await messageModel.create({
            fk_chat_id,
            fk_sender_user_id,
            mensaje
        });
    }
    async deleteById(message_id) {
        return await messageModel.findByIdAndDelete(message_id);
    }
    async updateById(message_id, update_data) {
        return await messageModel.findByIdAndUpdate(message_id, update_data, { new: true });
    }
}

   const messageRepository = new MessageRepository();
   export default messageRepository;