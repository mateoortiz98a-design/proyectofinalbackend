import { Server } from 'socket.io'

let io

export function initSocket(httpServer) {
    
   // Cambia la configuración del Server de socket.io por esta:
import { Server } from 'socket.io';

// La función debe recibir 'server' para poder usarlo adentro
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://proyectofinalfrontend-eight.vercel.app'
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Aquí abajo sigue el resto de tu lógica de io.on('connection', ...)
  return io;
};

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