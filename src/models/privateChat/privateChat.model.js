import mongoose from "mongoose";

const privateChatSchema = new mongoose.Schema({
    fk_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fk_user_id2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

export const PRIVATECHAT_MODEL_NAME = "PrivateChat";

const PrivateChat = mongoose.model(
    PRIVATECHAT_MODEL_NAME,
    privateChatSchema
);

export default PrivateChat;