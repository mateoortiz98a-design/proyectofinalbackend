import { Router } from "express";
import privateChatController from "../../controllers/privateChat/privateChat.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const privateChatRouter = Router();

// Obtener todos mis chats privados
privateChatRouter.get(
    "/",
    authMiddleware,
    privateChatController.getMine
);

// Obtener un chat por id
privateChatRouter.get(
    "/:chat_id",
    authMiddleware,
    privateChatController.getById
);

// Crear un chat privado
privateChatRouter.post(
    "/",
    authMiddleware,
    privateChatController.create
);

// Eliminar un chat
privateChatRouter.delete(
    "/:chat_id",
    authMiddleware,
    privateChatController.delete
);

export default privateChatRouter;