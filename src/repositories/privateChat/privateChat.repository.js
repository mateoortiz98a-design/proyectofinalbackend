import privateChatModel from "../../models/privateChat/privateChat.model.js";

class PrivateChatRepository {

    async getById(chat_id) {
        return await privateChatModel
            .findById(chat_id)
            .populate("fk_user_id", "name email")
            .populate("fk_user_id2", "name email");
    }

    async getChatBetweenUsers(user_id, user_id2) {
        return await privateChatModel.findOne({
            $or: [
                {
                    fk_user_id: user_id,
                    fk_user_id2: user_id2
                },
                {
                    fk_user_id: user_id2,
                    fk_user_id2: user_id
                }
            ]
        });
    }

    async getChatsByUser(user_id) {
        return await privateChatModel
            .find({
                $or: [
                    { fk_user_id: user_id },
                    { fk_user_id2: user_id }
                ]
            })
            .populate("fk_user_id", "name email")
            .populate("fk_user_id2", "name email")
            .sort({ fecha_creacion: -1 });
    }

    async create(user_id, user_id2) {
        return await privateChatModel.create({
            fk_user_id: user_id,
            fk_user_id2: user_id2
        });
    }

    async deleteById(chat_id) {
        return await privateChatModel.findByIdAndDelete(chat_id);
    }

}

const privateChatRepository = new PrivateChatRepository();
export default privateChatRepository;