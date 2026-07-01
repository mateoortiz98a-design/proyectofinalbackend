import  mongoose from 'mongoose';

const privateMessageSchema = new mongoose.Schema({    
    fk_private_chat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrivateChat",
        required: true
    },
    fk_sender_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    mensaje: {
        type: String,
        required: true
    }
})
export const PRIVATE_MESSAGE_MODEL_NAME = "PrivateMessage";
const PrivateMessage = mongoose.model(PRIVATE_MESSAGE_MODEL_NAME, privateMessageSchema);
export default PrivateMessage   

