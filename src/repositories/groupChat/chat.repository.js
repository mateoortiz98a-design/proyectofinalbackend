import chatModel from "../../models/groupChat/chat.model.js";

class ChatRepository {

    async getAll() {
        return await chatModel.find({ activo: true });
    }

    async getById(chat_id) {
        return await chatModel.findById(chat_id);
    }

    async getAllByWorkspace(workspace_id) {
        return await chatModel.find({
            fk_workspace_id: workspace_id,
            activo: true
        });
    }

    async create(fk_workspace_id, fk_creator_user_id, nombre) {
        return await chatModel.create({
            fk_workspace_id,
            fk_creator_user_id,
            nombre
        });
    }

    async deleteById(chat_id) {
        // Soft delete
        // return await chatModel.findByIdAndUpdate(chat_id, { activo: false });

        // Hard delete
        return await chatModel.findByIdAndDelete(chat_id);
    }
    async updateById(chat_id, update_data) {
        return await chatModel.findByIdAndUpdate(chat_id, update_data, { new: true });
    }
}

const chatRepository = new ChatRepository();
export default chatRepository;