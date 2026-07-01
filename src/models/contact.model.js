import mongoose from "mongoose";
import { USER_COLLECTION_NAME } from "./user.model.js";

const contactSchema = new mongoose.Schema({
    fk_sender_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: USER_COLLECTION_NAME
    },
    fk_receiver_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: USER_COLLECTION_NAME
    },
    status: {
        type: String,
        enum: ['PENDIENTE', 'ACEPTADO', 'RECHAZADO'],
        default: 'PENDIENTE'
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
})

export const CONTACT_COLLECTION_NAME = 'Contact'
const Contact = mongoose.model(CONTACT_COLLECTION_NAME, contactSchema)
export default Contact