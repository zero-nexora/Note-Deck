import { auditLogRepository } from "../repositories/audit.repository";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository";
import { CreateWorkspaceMemberInput } from "../schemas/workspace-member.schema";

export const workspaceMemberService = {
  invite: async (email: string, data: CreateWorkspaceMemberInput) => {
    const member = await workspaceMemberRepository.add(data);

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId: data.userId,
      action: "member.invited",
      entityType: "workspace_member",
      entityId: data.workspaceId,
      metadata: { email, role: data.role },
    });

    return member;
  },
};
