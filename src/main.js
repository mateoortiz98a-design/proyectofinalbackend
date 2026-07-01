import 'dotenv/config';
import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import express from "express";

/* SOLO EN LOCAL Y SI TENER PROBLEMAS DE DNS PARA CONECTARTE A MONGODB */
import dns from 'dns';
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

if(ENVIRONMENT.MODE === 'development'){
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

connectMongoDB()


import cors from 'cors'
import errorHandlerMiddleware from "./middlewares/error.middleware.js";

const app = express();
const PORT = ENVIRONMENT.PORT;

// Habilitamos las consultas cross-origin
app.use(cors())

// Parse JSON
app.use(express.json());
app.use('/api/workspace/:workspace_id/invite/:decision', memberWorkspaceController.processInvitation)
app.use('/api/auth', authRouter)
app.use('/api/workspace', authMiddleware, workspaceRouter)
app.use('/api/private-chat', authMiddleware, privateChatRouter)
app.use('/api/group-chat', authMiddleware, groupChatRouter)
app.use('/api/private-message', authMiddleware, privateMessageRouter)    
app.use('/api/message', authMiddleware, messageRouter)
app.use('/api/contact', authMiddleware, contactRouter)
app.use('/api/user', authMiddleware, userRouter)

app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


