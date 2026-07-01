import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    fk_chat_id: {
        type: mongoose.Schema.ObjectId, //Referencia a otra coleccion
        required: true,
        ref: "Chat"    //Referencia a otra coleccion   
    },  

    fk_sender_user_id: {
        type: mongoose.Schema.ObjectId, //Referencia a otra coleccion   
        required: true, 
        ref: "User"    //Referencia a otra coleccion
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    }
})
    export const MESSAGE_MODEL_NAME = "Message"
    const Message = mongoose.model(MESSAGE_MODEL_NAME, messageSchema);
    export default Message      
    