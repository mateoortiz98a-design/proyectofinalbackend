import { Server } from 'socket.io'

let io

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    })

    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id)

        socket.on('join_workspace', (workspace_id) => {
            socket.join(`workspace:${workspace_id}`)
        })

        socket.on('join_chat', (chat_id) => {
            socket.join(`chat:${chat_id}`)
        })

        socket.on('join_private_chat', (chat_id) => {
            socket.join(`private_chat:${chat_id}`)
        })

        socket.on('join_user', (user_id) => {
            socket.join(`user:${user_id}`)
        })

        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id)
        })
    })

    return io
}

export function getIO() {
    if (!io) throw new Error('Socket.io no inicializado')
    return io
}