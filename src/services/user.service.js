import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import contactRepository from "../repositories/contact.repository.js";
import privateChatRepository from "../repositories/privateChat/privateChat.repository.js";

class UserService {

    async getAll() {
        const users = await userRepository.getAll()
        if (!users || users.length === 0) {
            throw new ServerError("No hay usuarios registrados", 404)
        }
        return users
    }

    async getById(user_id) {
        const user = await userRepository.getById(user_id)
        if (!user) {
            throw new ServerError("Usuario no encontrado", 404)
        }
        return user
    }

    async deleteById(user_id) {
        const user = await userRepository.getById(user_id)
        if (!user) {
            throw new ServerError("Usuario no encontrado", 404)
        }

        // 1 — Transferir ownership donde es dueño
        const ownerMemberships = await workspaceMemberRepository.getOwnerMemberships(user_id)
        for (const membership of ownerMemberships) {
            const nextMember = await workspaceMemberRepository.getNextMember(
                membership.fk_workspace_id,
                user_id
            )
            if (nextMember) {
                await workspaceMemberRepository.updateById(nextMember._id, { rol: 'dueño' })
            } else {
                await workspaceRepository.softDeleteById(membership.fk_workspace_id)
            }
        }

        // 2 — Eliminar membresías del usuario
        const memberships = await workspaceMemberRepository.getByUserId(user_id)
        for (const m of memberships) {
            await workspaceMemberRepository.deleteById(m.member_id)
        }

        // 3 — Eliminar contactos
        await contactRepository.deleteAllByUser(user_id)

        // 4 — Marcar chats privados como eliminados por este usuario
        await privateChatRepository.markDeletedByUser(user_id)

        // 5 — Eliminar usuario
        await userRepository.deleteById(user_id)
    }

    async updateById(user_id, update_data) {
        const user = await userRepository.getById(user_id)
        if (!user) {
            throw new ServerError("Usuario no encontrado", 404)
        }
        if (update_data.name && update_data.name.length <= 2) {
            throw new ServerError("El nombre debe tener más de 2 caracteres", 400)
        }
        await userRepository.updateById(user_id, update_data)
    }
}

const userService = new UserService()
export default userService