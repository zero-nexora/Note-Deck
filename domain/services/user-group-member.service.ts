import { canUser } from "@/lib/check-permissions";
import { userGroupMemberRepository } from "../repositories/user-group-member.repository";
import { userGroupRepository } from "../repositories/user-group.repository";
import { userRepository } from "../repositories/user.repository";
import {
  AddGroupMemberInput,
  RemoveGroupMemberInput,
} from "../schemas/user-group-member.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { AUDIT_ACTION, ENTITY_TYPE, PERMISSIONS, ROLE } from "@/lib/constants";

export const userGroupMemberService = {
  add: async (userId: string, data: AddGroupMemberInput) => {
    const group = await userGroupRepository.findById(data.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: group.workspaceId,
      workspaceRole: ROLE.ADMIN,
      permission: PERMISSIONS.GROUP_MEMBER_ADD,
    });

    if (!allowed) throw new Error("Permission denied");

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existingMember =
      await userGroupMemberRepository.findByGroupIdAndUserId(
        data.groupId,
        data.userId
      );
    if (existingMember) {
      throw new Error("User is already in this group");
    }

    const member = await userGroupMemberRepository.add(data);

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: AUDIT_ACTION.USER_GROUP_MEMBER_ADDED,
      entityType: ENTITY_TYPE.USER_GROUP,
      entityId: data.groupId,
      metadata: {
        addedUserId: data.userId,
        addedUserEmail: user.email,
        groupName: group.name,
      },
    });

    return member;
  },

  remove: async (userId: string, data: RemoveGroupMemberInput) => {
    const group = await userGroupRepository.findById(data.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: group.workspaceId,
      workspaceRole: ROLE.ADMIN,
      permission: PERMISSIONS.GROUP_MEMBER_REMOVE,
    });

    if (!allowed) throw new Error("Permission denied");

    const member = await userGroupMemberRepository.findByGroupIdAndUserId(
      data.groupId,
      data.userId
    );
    if (!member) {
      throw new Error("User is not in this group");
    }

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: AUDIT_ACTION.USER_GROUP_MEMBER_REMOVED,
      entityType: ENTITY_TYPE.USER_GROUP,
      entityId: data.groupId,
      metadata: {
        removedUserId: data.userId,
        groupName: group.name,
      },
    });

    await userGroupMemberRepository.remove(data.groupId, data.userId);
  },

  list: async (userId: string, groupId: string) => {
    const group = await userGroupRepository.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: group.workspaceId,
      workspaceRole: ROLE.ADMIN,
    });
    if (!allowed) throw new Error("Permission denied");

    const members = await userGroupMemberRepository.findByGroupId(groupId);
    return members;
  },
};
