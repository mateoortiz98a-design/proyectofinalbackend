import MEMBER_INVITATION_STATUS from "../constants/memberInvitationStatus.constant.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js";
import memberWorkspaceService from "../services/memberWorkspace.service.js";
import jwt from 'jsonwebtoken'

class MemberWorkspaceController {
    async inviteUser(request, response) {
            const { workspace_id } = request.params;
            const { invited_email, role } = request.body;
            const { id: client_id } = request.user;

            
            if (!invited_email || !role) {
                throw new ServerError("Faltan datos obligatorios (email y rol)", 400);
            }

            await memberWorkspaceService.inviteUser(
                client_id,
                invited_email,
                workspace_id,
                role
            )

            return response.status(200).json({ 
                ok: true, 
                message: "Invitación enviada con éxito" 
            });

       
    }

    async processInvitation(request, response) {
    
            const { decision } = request.params;
            const { invitation_token } = request.query;

            if (!invitation_token) throw new ServerError("Falta token de invitacion", 400);
            if (decision !== MEMBER_INVITATION_STATUS.ACCEPTED && decision !== MEMBER_INVITATION_STATUS.REJECTED){
                throw new ServerError("Decisión no válida", 400);
            }
            await memberWorkspaceService.memberDesicion(invitation_token, decision)
            
            response.json({
                ok: true,
                status: 200,
                message: `Decision de ${decision} tomada con exito!`
            })

        
    }

    // lista las invitaciones pendientes del usuario logueado.
    // Se llama al iniciar sesión para no depender de estar online cuando te invitan.
    async getPendingInvitations(request, response, next) {
        try {
            const { id: user_id } = request.user;

            const invitations = await memberWorkspaceService.getPendingInvitations(user_id);

            return response.status(200).json({
                ok: true,
                data: { invitations }
            });

        } catch (error) {
            next(error);
        }
    }

    async removeMember(request, response) {
    const { workspace_id, member_id } = request.params;
console.log('eliminando member_id:', member_id) 
    await workspaceMemberRepository.deleteById(member_id);

    return response.status(200).json({
        ok: true,
        message: "Miembro eliminado con éxito"
    });
}

async updateMemberRole(request, response) {
    const { member_id } = request.params;
    const { role } = request.body;

    if (!role) throw new ServerError("Falta el rol", 400);

    await workspaceMemberRepository.updateById(member_id, { rol: role });

    return response.status(200).json({
        ok: true,
        message: "Rol actualizado con éxito"
    });
}
async getMembers(request, response) {
    const { workspace_id } = request.params;

    const members = await workspaceMemberRepository.getByWorkspaceId(workspace_id);

    return response.status(200).json({
        ok: true,
        data: { members }
    });
}

}

const memberWorkspaceController = new MemberWorkspaceController()
export default memberWorkspaceController