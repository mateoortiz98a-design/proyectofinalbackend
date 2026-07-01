import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING + "/" + ENVIRONMENT.MONGO_DB_NAME,);
    console.log("Connected to MongoDB successfully!");
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } 
}
 export default connectToMongoDB;