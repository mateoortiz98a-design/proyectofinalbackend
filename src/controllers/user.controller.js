import userService from "../services/user.service.js";

class UserController {

    async getAll(request, response) {
        const users = await userService.getAll()
        return response.status(200).json({
            ok: true,
            data: { users }
        })
    }

    async getById(request, response) {
        const { user_id } = request.params
        const user = await userService.getById(user_id)
        return response.status(200).json({
            ok: true,
            data: { user }
        })
    }

    async deleteById(request, response) {
        const { user_id } = request.params
        await userService.deleteById(user_id)
        return response.status(200).json({
            ok: true,
            message: "Usuario eliminado correctamente"
        })
    }

    async updateById(request, response) {
        const { user_id } = request.params
        const { name } = request.body
        await userService.updateById(user_id, { name })
        return response.status(200).json({
            ok: true,
            message: "Usuario actualizado correctamente"
        })
    }
}

const userController = new UserController()
export default userController