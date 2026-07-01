import { Router } from "express";
import messageController from "../../controllers/groupChat/message.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const messageRouter = Router();

// Obtener todos los mensajes de un chat
messageRouter.get(
    "/chat/:chat_id",
    authMiddleware,
    messageController.getAll
);

// Obtener un mensaje por ID
messageRouter.get(
    "/:message_id",
    authMiddleware,
    messageController.getById
);

// Enviar un mensaje
messageRouter.post(
    "/chat/:chat_id",
    authMiddleware,
    messageController.create
);

// Editar un mensaje
messageRouter.put(
    "/:message_id",
    authMiddleware,
    messageController.update
);

// Eliminar un mensaje
messageRouter.delete(
    "/:message_id",
    authMiddleware,
    messageController.delete
);

export default messageRouter;