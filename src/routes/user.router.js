import express from 'express'
import userController from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/', userController.getAll)
userRouter.get('/:user_id', userController.getById)
userRouter.delete('/:user_id', userController.deleteById)
userRouter.put('/:user_id', userController.updateById)

export default userRouter