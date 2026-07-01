import  Mongoose  from "mongoose";


const userSchema = new Mongoose.Schema(
    { 
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        fecha_creacion: {
            type: Date,
            default: Date.now,
            required: true
        },
        activo: {
            type: Boolean,
            default: true,
            required: true
        },
        email_verificado: {
            type: Boolean,
            default: false,
            required: true
        }
         }
)
export  const USER_COLLECTION_NAME = "User"
const User = Mongoose.model(USER_COLLECTION_NAME, userSchema);

export default User

