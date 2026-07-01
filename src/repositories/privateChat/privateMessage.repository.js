import privateMessageModel from "../../models/privateChat/privateMessage.model.js";

class PrivateMessageRepository {

    async getAllByChat(chat_id) {
        return await privateMessageModel
            .find({ fk_private_chat_id: chat_id })
            .populate("fk_sender_user_id", "name email")
            .sort({ fecha_creacion: 1 });
    }

    async getById(message_id) {
        return await privateMessageModel
            .findById(message_id)
            .populate("fk_sender_user_id", "name email");
    }

    async create(fk_private_chat_id, fk_sender_user_id, mensaje) {
        return await privateMessageModel.create({
            fk_private_chat_id,
            fk_sender_user_id,
            mensaje
        });
    }

    async updateById(message_id, update_data) {
        return await privateMessageModel.findByIdAndUpdate(
            message_id,
            update_data,
            { new: true }
        );
    }

    async deleteById(message_id) {
        return await privateMessageModel.findByIdAndDelete(message_id);
    }

}

const privateMessageRepository = new PrivateMessageRepository();
export default privateMessageRepository;