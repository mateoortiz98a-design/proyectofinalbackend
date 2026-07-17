import express from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import workspaceController from '../controllers/workspace.controller.js';
import workspaceMiddleware from '../middlewares/workspace.middleware.js';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles.constant.js';
import memberWorkspaceController from '../controllers/memberWorkspace.controller.js';

const workspaceRouter = express.Router();

//Lo pongo arriba ya que no quiero que este alcanzado por el auth middleware


//Configuramos el authMiddleware a nivel de ruta
workspaceRouter.use(authMiddleware);

workspaceRouter.post('/', workspaceController.create);

workspaceRouter.get('/', workspaceController.getAllByUser);

//  invitaciones pendientes del usuario logueado (se carga al iniciar sesión)
workspaceRouter.get('/invitations/pending', memberWorkspaceController.getPendingInvitations);

workspaceRouter.delete(
    '/:workspace_id', 
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]), 
    workspaceController.deleteById
)

workspaceRouter.put(
    '/:workspace_id', 
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.ADMIN, MEMBER_WORKSPACE_ROLES.OWNER]), 
    workspaceController.updateById
)

//  salir del workspace (cualquier miembro que forme parte puede salir del suyo,
// por eso NO lleva workspaceMiddleware de rol — el service valida la membresía)
workspaceRouter.delete(
    '/:workspace_id/leave',
    memberWorkspaceController.leaveWorkspace
)

workspaceRouter.post(
    '/:workspace_id/members',
    authMiddleware,
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    memberWorkspaceController.inviteUser
);
// Eliminar miembro
workspaceRouter.delete(
    '/:workspace_id/members/:member_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    memberWorkspaceController.removeMember
)

// Cambiar rol
workspaceRouter.put(
    '/:workspace_id/members/:member_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    memberWorkspaceController.updateMemberRole
)
workspaceRouter.get(
    '/:workspace_id/members',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN, MEMBER_WORKSPACE_ROLES.USER]),
    memberWorkspaceController.getMembers
)

export default workspaceRouter;