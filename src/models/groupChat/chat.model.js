import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    fk_workspace_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },

    fk_creator_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    nombre: {
        type: String,
        required: true
    },

    activo: {
        type: Boolean,
        default: true
    },

    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

export const CHAT_MODEL_NAME = "Chat";

const Chat = mongoose.model(CHAT_MODEL_NAME, chatSchema);

export default Chat;