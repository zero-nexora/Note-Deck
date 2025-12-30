import {
  CreateUserGroupInput,
  DeleteUserGroupInput,
  UpdateUserGroupInput,
} from "../schemas/user-group.schema";
import { checkWorkspacePermission } from "@/lib/permissions";
import { userGroupRepository } from "../repositories/user-group.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { userGroupMemberRepository } from "../repositories/user-group-member.repository";

export const userGroupService = {
  create: async (userId: string, data: CreateUserGroupInput) => {
    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const group = await userGroupRepository.create(data);

    await userGroupMemberRepository.add({ groupId: group.id, userId });

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "user_group.created",
      entityType: "user_group",
      entityId: group.id,
      metadata: { name: group.name },
    });

    return group;
  },

  findById: async (id: string) => {
    const userGroup = await userGroupRepository.findById(id);
    return userGroup;
  },

  findByWorkspaceId: async (workspaceId: string) => {
    const userGroups = await userGroupRepository.findByWorkspaceId(workspaceId);
    return userGroups;
  },

  update: async (userId: string, id: string, data: UpdateUserGroupInput) => {
    const group = await userGroupRepository.findById(id);
    if (!group) throw new Error("Group not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      group.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (data.name && data.name.trim() === "") {
      throw new Error("Group name cannot be empty");
    }

    const updated = await userGroupRepository.update(id, data);

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: "user_group.updated",
      entityType: "user_group",
      entityId: id,
      metadata: data,
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteUserGroupInput) => {
    const group = await userGroupRepository.findById(data.id);
    if (!group) throw new Error("Group not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      group.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    await userGroupRepository.delete(data.id);

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: "user_group.deleted",
      entityType: "user_group",
      entityId: data.id,
      metadata: { name: group.name },
    });
  },
};
