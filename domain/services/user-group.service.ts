import {
  CreateUserGroupInput,
  DeleteUserGroupInput,
  FindUserGroupInput,
  FindUserGroupsByWorkspaceInput,
  UpdateUserGroupInput,
} from "../schemas/user-group.schema";
import { canUser } from "@/lib/check-permissions";
import { userGroupRepository } from "../repositories/user-group.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { userGroupMemberRepository } from "../repositories/user-group-member.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import { AUDIT_ACTION, ENTITY_TYPE, PERMISSIONS, ROLE } from "@/lib/constants";

export const userGroupService = {
  create: async (userId: string, data: CreateUserGroupInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: data.workspaceId,
      workspaceRole: ROLE.ADMIN,
      permission: PERMISSIONS.GROUP_CREATE,
    });
    if (!allowed) throw new Error("Permission denied");

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
      workspaceId: workspace.id,
      userId,
      action: AUDIT_ACTION.USER_GROUP_CREATED,
      entityType: ENTITY_TYPE.USER_GROUP,
      entityId: group.id,
      metadata: {
        name: group.name,
        permissions: group.permissions,
      },
    });

    return group;
  },

  findById: async (userId: string, data: FindUserGroupInput) => {
    const group = await userGroupRepository.findById(data.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: group.workspaceId,
      workspaceRole: ROLE.OBSERVER,
    });
    if (!allowed) throw new Error("Permission denied");

    return group;
  },

  findByWorkspaceId: async (
    userId: string,
    data: FindUserGroupsByWorkspaceInput
  ) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: data.workspaceId,
      workspaceRole: ROLE.OBSERVER,
    });
    if (!allowed) throw new Error("Permission denied");

    const userGroups = await userGroupRepository.findByWorkspaceIdWithMembers(
      data.workspaceId
    );
    return userGroups;
  },

  update: async (
    userId: string,
    groupId: string,
    data: UpdateUserGroupInput
  ) => {
    const group = await userGroupRepository.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: group.workspaceId,
      workspaceRole: ROLE.ADMIN,
      permission: PERMISSIONS.GROUP_UPDATE,
    });
    if (!allowed) throw new Error("Permission denied");

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

    const updatedGroup = await userGroupRepository.update(groupId, updateData);

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
      action: AUDIT_ACTION.USER_GROUP_UPDATED,
      entityType: ENTITY_TYPE.USER_GROUP,
      entityId: group.id,
      metadata,
    });

    return updatedGroup;
  },

  delete: async (userId: string, data: DeleteUserGroupInput) => {
    const group = await userGroupRepository.findById(data.id);
    if (!group) {
      throw new Error("Group not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: group.workspaceId,
      workspaceRole: ROLE.ADMIN,
      permission: PERMISSIONS.GROUP_DELETE,
    });
    if (!allowed) throw new Error("Permission denied");

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: AUDIT_ACTION.USER_GROUP_DELETED,
      entityType: ENTITY_TYPE.USER_GROUP,
      entityId: group.id,
      metadata: {
        name: group.name,
        permissions: group.permissions,
      },
    });

    await userGroupRepository.delete(data.id);
  },
};
