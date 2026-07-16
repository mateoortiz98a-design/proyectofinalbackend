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
                { fk_user_id: user_id, fk_user_id2: user_id2 },
                { fk_user_id: user_id2, fk_user_id2: user_id }
            ]
        });
    }

    async getChatsByUser(user_id) {
        return await privateChatModel
            .find({
                $or: [
                    { fk_user_id: user_id },
                    { fk_user_id2: user_id }
                ],
                deleted_by: { $ne: user_id }
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

    //  borrado lógico de UN chat puntual, solo para el usuario que lo borra.
    // La conversación sigue existiendo entera para el otro participante.
    async markDeletedByUserForChat(chat_id, user_id) {
        return await privateChatModel.findByIdAndUpdate(
            chat_id,
            { $addToSet: { deleted_by: user_id } },
            { new: true }
        );
    }

    // 🔥 NUEVO: si el usuario había borrado el chat de su lado y vuelve a iniciarlo
    // con el mismo contacto, lo "restauramos" de su lista (sin perder el historial).
    async unmarkDeletedByUserForChat(chat_id, user_id) {
        return await privateChatModel.findByIdAndUpdate(
            chat_id,
            { $pull: { deleted_by: user_id } },
            { new: true }
        );
    }

    async markDeletedByUser(user_id) {
        return await privateChatModel.updateMany(
            {
                $or: [
                    { fk_user_id: user_id },
                    { fk_user_id2: user_id }
                ]
            },
            { $addToSet: { deleted_by: user_id } }
        )
    }
}

const privateChatRepository = new PrivateChatRepository();
export default privateChatRepository;