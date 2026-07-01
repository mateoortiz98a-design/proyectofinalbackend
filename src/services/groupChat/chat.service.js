import chatRepository from "../../repositories/groupChat/chat.repository.js";
import workspaceRepository from "../../repositories/workspace.repository.js";
import workspaceMemberRepository from "../../repositories/workspaceMember.repository.js";

class ChatService {

    async getChatsByWorkspace(workspace_id) {
        return await chatRepository.getAllByWorkspace(workspace_id);
    }

    async getChatById(chat_id) {
        const chat = await chatRepository.getById(chat_id);

        if (!chat) {
            throw new Error("Chat no encontrado");
        }

        return chat;
    }

    async createChat(workspace_id, user_id, nombre) {

        const workspace = await workspaceRepository.getById(workspace_id);

        if (!workspace) {
            throw new Error("Workspace no encontrado");
        }

        const member = await workspaceMemberRepository.getMemberByWorkspaceAndUserId(
            workspace_id,
            user_id
        );

        if (!member) {
            throw new Error("El usuario no pertenece al workspace");
        }

        return await chatRepository.create(
            workspace_id,
            user_id,
            nombre
        );
    }

    async deleteChat(chat_id) {

        const chat = await chatRepository.getById(chat_id);

        if (!chat) {
            throw new Error("Chat no encontrado");
        }

        await chatRepository.deleteById(chat_id);
    }
}

const chatService = new ChatService();
export default chatService;