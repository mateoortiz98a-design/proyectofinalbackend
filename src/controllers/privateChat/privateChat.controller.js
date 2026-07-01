import privateChatService from "../../services/privateChat/privateChat.service.js";

class PrivateChatController {

    async getMine(req, res, next) {

        try {

            const chats =
                await privateChatService.getMyChats(
                    req.user.id
                );

            return res.status(200).json({
                ok: true,
                chats
            });

        } catch (error) {

            next(error);

        }

    }

    async getById(req, res, next) {

        try {

            const chat =
                await privateChatService.getChat(
                    req.params.chat_id
                );

            return res.status(200).json({
                ok: true,
                chat
            });

        } catch (error) {

            next(error);

        }

    }

    async create(req, res, next) {

        try {

            const chat =
                await privateChatService.createChat(
                    req.user.id,
                    req.body.user_id
                );

            return res.status(201).json({
                ok: true,
                message: "Chat privado creado correctamente.",
                chat
            });

        } catch (error) {

            next(error);

        }

    }

    async delete(req, res, next) {

        try {

            await privateChatService.deleteChat(
                req.params.chat_id,
                req.user.id
            );

            return res.status(200).json({
                ok: true,
                message: "Chat eliminado correctamente."
            });

        } catch (error) {

            next(error);

        }

    }

}

const privateChatController = new PrivateChatController();

export default privateChatController;