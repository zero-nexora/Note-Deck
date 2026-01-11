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
  TransferOwnershipInput,
} from "../schemas/workspace-member.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";
import {
  AUDIT_ACTION,
  DEFAULT_WORKSPACE_MEMBER_ROLE,
  ENTITY_TYPE,
  ROLE,
} from "@/lib/constants";

export const workspaceMemberService = {
  add: async (userId: string, data: AddMemberInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existingMember =
      await workspaceMemberRepository.findByWorkspaceIdAndUserId(
        data.workspaceId,
        data.userId
      );
    if (existingMember) {
      throw new Error("User is already a member");
    }

    const role = data.role || DEFAULT_WORKSPACE_MEMBER_ROLE;

    const member = await workspaceMemberRepository.add({
      workspaceId: data.workspaceId,
      userId: data.userId,
      role,
    });

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: AUDIT_ACTION.WORKSPACE_MEMBER_ADDED,
      entityType: ENTITY_TYPE.WORKSPACE_MEMBER,
      entityId: member.id,
      metadata: {
        addedUserId: data.userId,
        addedUserEmail: user.email,
        role,
      },
    });

    return member;
  },

  remove: async (userId: string, data: RemoveMemberInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.ownerId === data.userId) {
      throw new Error("Cannot remove workspace owner");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const member = await workspaceMemberRepository.findByWorkspaceIdAndUserId(
      data.workspaceId,
      data.userId
    );
    if (!member) {
      throw new Error("Member not found");
    }

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: AUDIT_ACTION.WORKSPACE_MEMBER_REMOVED,
      entityType: ENTITY_TYPE.WORKSPACE,
      entityId: member.id,
      metadata: {
        removedUserId: data.userId,
        removedUserRole: member.role,
      },
    });

    await workspaceMemberRepository.remove(data.workspaceId, data.userId);
  },

  changeRole: async (userId: string, data: ChangeMemberRoleInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.ownerId === data.userId) {
      throw new Error("Cannot change owner role");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const member = await workspaceMemberRepository.findByWorkspaceIdAndUserId(
      data.workspaceId,
      data.userId
    );
    if (!member) {
      throw new Error("Member not found");
    }

    if (member.role === data.role) {
      return member;
    }

    const updatedMember = await workspaceMemberRepository.updateRole(
      data.workspaceId,
      data.userId,
      data.role
    );

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: AUDIT_ACTION.WORKSPACE_MEMBER_ROLE_CHANGED,
      entityType: ENTITY_TYPE.WORKSPACE,
      entityId: member.id,
      metadata: {
        targetUserId: data.userId,
        oldRole: member.role,
        newRole: data.role,
      },
    });

    return updatedMember;
  },

  list: async (userId: string, data: ListMembersInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const members = await workspaceMemberRepository.findByWorkspaceIdWithUser(
      data.workspaceId
    );

    return members;
  },

  leave: async (userId: string, data: LeaveWorkspaceInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.ownerId === userId) {
      throw new Error(
        "Owner cannot leave workspace. Transfer ownership first."
      );
    }

    const member = await workspaceMemberRepository.findByWorkspaceIdAndUserId(
      data.workspaceId,
      userId
    );
    if (!member) {
      throw new Error("You are not a member of this workspace");
    }

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: AUDIT_ACTION.WORKSPACE_MEMBER_LEFT,
      entityType: ENTITY_TYPE.WORKSPACE,
      entityId: member.id,
      metadata: {
        role: member.role,
      },
    });

    await workspaceMemberRepository.remove(data.workspaceId, userId);
  },

  transferOwnership: async (userId: string, data: TransferOwnershipInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.ownerId !== userId) {
      throw new Error("Only owner can transfer ownership");
    }

    if (workspace.ownerId === data.newOwnerId) {
      throw new Error("User is already workspace owner");
    }

    const newOwnerMember =
      await workspaceMemberRepository.findByWorkspaceIdAndUserId(
        data.workspaceId,
        data.newOwnerId
      );

    if (!newOwnerMember) {
      throw new Error("New owner must be a workspace member");
    }

    await workspaceMemberRepository.updateRole(
      data.workspaceId,
      data.newOwnerId,
      ROLE.ADMIN
    );

    await workspaceRepository.updateOwner(data.workspaceId, data.newOwnerId);

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: AUDIT_ACTION.WORKSPACE_OWNERSHIP_TRANSFERRED,
      entityType: ENTITY_TYPE.WORKSPACE,
      entityId: data.workspaceId,
      metadata: {
        oldOwnerId: userId,
        newOwnerId: data.newOwnerId,
      },
    });
  },
};
