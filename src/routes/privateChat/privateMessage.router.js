import { Router } from "express";
import privateMessageController from "../../controllers/privateChat/privateMessage.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const privateMessageRouter = Router();

// Obtener mensajes de un chat privado
privateMessageRouter.get(
    "/chat/:chat_id",
    authMiddleware,
    privateMessageController.getAll
);

// Obtener un mensaje por id
privateMessageRouter.get(
    "/:message_id",
    authMiddleware,
    privateMessageController.getById
);

// Enviar mensaje
privateMessageRouter.post(
    "/chat/:chat_id",
    authMiddleware,
    privateMessageController.create
);

// Editar mensaje
privateMessageRouter.put(
    "/:message_id",
    authMiddleware,
    privateMessageController.update
);

// Eliminar mensaje
privateMessageRouter.delete(
    "/:message_id",
    authMiddleware,
    privateMessageController.delete
);

export default privateMessageRouter;