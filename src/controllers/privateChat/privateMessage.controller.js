import privateMessageService from "../../services/privateChat/privateMessage.service.js";

class PrivateMessageController {

    async getAll(req, res, next) {

        try {

            const messages =
                await privateMessageService.getMessages(
                    req.params.chat_id,
                    req.user.id
                );

            return res.status(200).json({
                ok: true,
                messages
            });

        } catch (error) {

            next(error);

        }

    }

    async getById(req, res, next) {

        try {

            const message =
                await privateMessageService.getMessageById(
                    req.params.message_id
                );

            return res.status(200).json({
                ok: true,
                message
            });

        } catch (error) {

            next(error);

        }

    }

    async create(req, res, next) {

        try {

            const message =
                await privateMessageService.createMessage(
                    req.params.chat_id,
                    req.user.id,
                    req.body.mensaje
                );

            return res.status(201).json({
                ok: true,
                message: "Mensaje enviado correctamente.",
                data: message
            });

        } catch (error) {

            next(error);

        }

    }

    async update(req, res, next) {

        try {

            const message =
                await privateMessageService.updateMessage(
                    req.params.message_id,
                    req.user.id,
                    req.body
                );

            return res.status(200).json({
                ok: true,
                message: "Mensaje actualizado correctamente.",
                data: message
            });

        } catch (error) {

            next(error);

        }

    }

    async delete(req, res, next) {

        try {

            await privateMessageService.deleteMessage(
                req.params.message_id,
                req.user.id
            );

            return res.status(200).json({
                ok: true,
                message: "Mensaje eliminado correctamente."
            });

        } catch (error) {

            next(error);

        }

    }

}

const privateMessageController = new PrivateMessageController();
export default privateMessageController;