import {
  CreateUserGroupInput,
  DeleteUserGroupInput,
  UpdateUserGroupInput,
} from "../schemas/user-group.schema";
import { checkWorkspacePermission } from "@/lib/check-permissions";
import { userGroupRepository } from "../repositories/user-group.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { userGroupMemberRepository } from "../repositories/user-group-member.repository";
import { workspaceRepository } from "../repositories/workspace.repository";

export const userGroupService = {
  create: async (userId: string, data: CreateUserGroupInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      throw new Error("Group name cannot be empty");
    }

    const groupData = {
      ...data,
      name: trimmedName,
    };

    const group = await userGroupRepository.create(groupData);

    await userGroupMemberRepository.add({ groupId: group.id, userId });

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "user_group.created",
      entityType: "user_group",
      entityId: group.id,
      metadata: {
        name: group.name,
        permissions: group.permissions,
      },
    });

    return group;
  },

  findById: async (userId: string, id: string) => {
    const group = await userGroupRepository.findById(id);
    if (!group) {
      throw new Error("Group not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      group.workspaceId,
      "observer"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    return group;
  },

  findByWorkspaceId: async (userId: string, workspaceId: string) => {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      workspaceId,
      "observer"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const userGroups = await userGroupRepository.findByWorkspaceId(workspaceId);
    return userGroups;
  },

  update: async (userId: string, id: string, data: UpdateUserGroupInput) => {
    const group = await userGroupRepository.findById(id);
    if (!group) {
      throw new Error("Group not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      group.workspaceId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        throw new Error("Group name cannot be empty");
      }
      updateData.name = trimmedName;

      if (group.name === trimmedName && !data.permissions) {
        return group;
      }
    }

    if (
      data.permissions !== undefined &&
      JSON.stringify(group.permissions) === JSON.stringify(data.permissions) &&
      !data.name
    ) {
      return group;
    }

    const updated = await userGroupRepository.update(id, updateData);

    const metadata: Record<string, any> = {};
    if (data.name !== undefined) {
      metadata.oldName = group.name;
      metadata.newName = updateData.name;
    }
    if (data.permissions !== undefined) {
      metadata.oldPermissions = group.permissions;
      metadata.newPermissions = data.permissions;
    }

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: "user_group.updated",
      entityType: "user_group",
      entityId: id,
      metadata,
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteUserGroupInput) => {
    const group = await userGroupRepository.findById(data.id);
    if (!group) {
      throw new Error("Group not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      group.workspaceId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: "user_group.deleted",
      entityType: "user_group",
      entityId: data.id,
      metadata: {
        name: group.name,
        permissions: group.permissions,
      },
    });

    await userGroupRepository.delete(data.id);
  },
};
