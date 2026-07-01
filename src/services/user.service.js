import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";

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