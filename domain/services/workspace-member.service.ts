import { auditLogRepository } from "../repositories/audit.repository";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository";
import {
  CreateWorkspaceMemberInput,
  DeleteWorkspaceMemberInput,
  UpdateWorkspaceMemberInput,
} from "../schemas/workspace-member.schema";
import { checkWorkspacePermission } from "@/lib/permissions";

export const workspaceMemberService = {
  invite: async (
    userId: string,
    email: string,
    data: CreateWorkspaceMemberInput
  ) => {
    const allowed = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!allowed) throw new Error("Permission denied");

    const exists = await workspaceMemberRepository.findByWorkspaceAndUser(
      data.workspaceId,
      data.userId
    );
    if (exists) throw new Error("User already in workspace");

    const member = await workspaceMemberRepository.add({
      workspaceId: data.workspaceId,
      userId: data.userId,
      role: data.role ?? "normal",
      isGuest: data.isGuest ?? false,
    });

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "member.invited",
      entityType: "workspace_member",
      entityId: member.id,
      metadata: { email, role: member.role },
    });

    return member;
  },

  update: async (userId: string, data: UpdateWorkspaceMemberInput) => {
    const allowed = await checkWorkspacePermission(
      userId,
      data.workspaceId!,
      "admin"
    );
    if (!allowed) throw new Error("Permission denied");

    const member = await workspaceMemberRepository.findByWorkspaceAndUser(
      data.workspaceId!,
      userId
    );
    if (!member) throw new Error("Workspace member not found");

    const updated = await workspaceMemberRepository.update(
      data.workspaceId!,
      userId,
      {
        role: data.role,
        isGuest: data.isGuest,
      }
    );

    if (!updated) throw new Error("Update failed");

    await auditLogRepository.create({
      workspaceId: data.workspaceId!,
      userId,
      action: "member.updated",
      entityType: "workspace_member",
      entityId: member.id,
      metadata: { role: data.role, isGuest: data.isGuest },
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteWorkspaceMemberInput) => {
    const allowed = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!allowed) throw new Error("Permission denied");

    const member = await workspaceMemberRepository.findByWorkspaceAndUser(
      data.workspaceId,
      data.userId
    );
    if (!member) throw new Error("Workspace member not found");

    await workspaceMemberRepository.delete(data.workspaceId, data.userId);

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "member.removed",
      entityType: "workspace_member",
      entityId: member.id,
      metadata: { userId: data.userId },
    });

    return true;
  },

  findMembersByWorkspaceId: async (userId: string, workspaceId: string) => {
    const allowed = await checkWorkspacePermission(
      userId,
      workspaceId,
      "observer"
    );
    if (!allowed) throw new Error("Permission denied");

    return workspaceMemberRepository.findMembersByWorkspaceId(workspaceId);
  },
};
