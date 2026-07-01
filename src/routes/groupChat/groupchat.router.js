import { Router } from "express";
import chatController from "../../controllers/groupChat/chat.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const chatRouter = Router();

// Obtener todos los chats de un workspace
chatRouter.get(
    "/workspace/:workspace_id",
    authMiddleware,
    chatController.getAll
);

// Obtener un chat por ID
chatRouter.get(
    "/:chat_id",
    authMiddleware,
    chatController.getById
);

// Crear un chat
chatRouter.post(
    "/workspace/:workspace_id",
    authMiddleware,
    chatController.create
);

// Eliminar un chat
chatRouter.delete(
    "/:chat_id",
    authMiddleware,
    chatController.delete
);

export default chatRouter;