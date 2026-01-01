import { workspaceMemberRepository } from "../repositories/workspace-member.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import { userRepository } from "../repositories/user.repository";
import { checkWorkspacePermission } from "@/lib/check-permissions";
import {
  AddMemberInput,
  ChangeMemberRoleInput,
  LeaveWorkspaceInput,
  ListMembersInput,
  RemoveMemberInput,
} from "../schemas/workspace-member.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";

export const workspaceMemberService = {
  add: async (userId: string, data: AddMemberInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const user = await userRepository.findById(data.userId);
    if (!user) throw new Error("User not found");

    const exists = await workspaceMemberRepository.findByWorkspaceIdAndUserId(
      data.workspaceId,
      data.userId
    );
    if (exists) throw new Error("User is already a member");

    const member = await workspaceMemberRepository.add({
      workspaceId: data.workspaceId,
      userId: data.userId,
      role: data.role || "normal",
    });

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "workspace.member_added",
      entityType: "workspace_member",
      entityId: member.id,
      metadata: { addedUserId: data.userId, role: data.role },
    });

    return member;
  },

  remove: async (userId: string, data: RemoveMemberInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    if (workspace.ownerId === data.userId) {
      throw new Error("Cannot remove workspace owner");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const member = await workspaceMemberRepository.findByWorkspaceIdAndUserId(
      data.workspaceId,
      data.userId
    );
    if (!member) throw new Error("Member not found");

    await workspaceMemberRepository.remove(data.workspaceId, data.userId);

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "workspace.member_removed",
      entityType: "workspace_member",
      entityId: member.id,
      metadata: { removedUserId: data.userId },
    });
  },

  changeRole: async (userId: string, data: ChangeMemberRoleInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    if (workspace.ownerId === data.userId) {
      throw new Error("Cannot change owner role");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const member = await workspaceMemberRepository.findByWorkspaceIdAndUserId(
      data.workspaceId,
      data.userId
    );
    if (!member) throw new Error("Member not found");

    const updated = await workspaceMemberRepository.updateRole(
      data.workspaceId,
      data.userId,
      data.role
    );

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "workspace.member_role_changed",
      entityType: "workspace_member",
      entityId: member.id,
      metadata: { oldRole: member.role, newRole: data.role },
    });

    return updated;
  },

  list: async (userId: string, data: ListMembersInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const members = await workspaceMemberRepository.findByWorkspaceId(
      data.workspaceId
    );

    return members;
  },

  leave: async (userId: string, data: LeaveWorkspaceInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    if (workspace.ownerId === userId) {
      throw new Error(
        "Owner cannot leave workspace. Transfer ownership first."
      );
    }

    const member = await workspaceMemberRepository.findByWorkspaceIdAndUserId(
      data.workspaceId,
      userId
    );
    if (!member) throw new Error("You are not a member");

    await workspaceMemberRepository.remove(data.workspaceId, userId);

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "workspace.member_left",
      entityType: "workspace_member",
      entityId: member.id,
      metadata: {},
    });
  },
};
