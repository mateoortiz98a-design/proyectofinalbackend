import 'dotenv/config';
import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import express from "express";
import { createServer } from 'http';
import dns from 'dns';
import cors from 'cors';
import authRouter from "./routes/auth.router.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import workspaceRouter from "./routes/workspace.router.js";
import privateChatRouter from "./routes/privateChat/privateChat.router.js";
import groupChatRouter from "./routes/groupChat/groupchat.router.js";
import privateMessageRouter from "./routes/privateChat/privateMessage.router.js";
import messageRouter from "./routes/groupChat/message.router.js";
import contactRouter from "./routes/contact.router.js";
import userRouter from "./routes/user.router.js";
import memberWorkspaceController from "./controllers/memberWorkspace.controller.js";
import errorHandlerMiddleware from "./middlewares/error.middleware.js";
import { initSocket } from './config/socket.config.js';

dns.setDefaultResultOrder('ipv4first'); 

if (ENVIRONMENT.MODE === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

connectMongoDB()

const app = express();
const httpServer = createServer(app);
const PORT = ENVIRONMENT.PORT;

// Inicializar Socket.io
const io = initSocket(httpServer);

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://proyectofinalfrontend-eight.vercel.app'
    ],
    credentials: true
}))

app.use(express.json());

app.get('/api/workspace/:workspace_id/invite/:decision', memberWorkspaceController.processInvitation)
app.use('/api/auth', authRouter)
app.use('/api/workspace', authMiddleware, workspaceRouter)
app.use('/api/private-chat', authMiddleware, privateChatRouter)
app.use('/api/group-chat', authMiddleware, groupChatRouter)
app.use('/api/private-message', authMiddleware, privateMessageRouter)
app.use('/api/message', authMiddleware, messageRouter)
app.use('/api/contact', authMiddleware, contactRouter)
app.use('/api/user', authMiddleware, userRouter)

app.use(errorHandlerMiddleware)

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});