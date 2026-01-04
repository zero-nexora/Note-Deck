import { checkWorkspacePermission } from "@/lib/check-permissions";
import { userGroupMemberRepository } from "../repositories/user-group-member.repository";
import { userGroupRepository } from "../repositories/user-group.repository";
import { userRepository } from "../repositories/user.repository";
import {
  AddGroupMemberInput,
  RemoveGroupMemberInput,
} from "../schemas/user-group-member.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";

export const userGroupMemberService = {
  addMember: async (userId: string, data: AddGroupMemberInput) => {
    const group = await userGroupRepository.findById(data.groupId);
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

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const exists = await userGroupMemberRepository.findByGroupIdAndUserId(
      data.groupId,
      data.userId
    );
    if (exists) {
      throw new Error("User is already in this group");
    }

    const member = await userGroupMemberRepository.add(data);

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: "user_group.member_added",
      entityType: "user_group",
      entityId: data.groupId,
      metadata: {
        addedUserId: data.userId,
        addedUserEmail: user.email,
        groupName: group.name,
      },
    });

    return member;
  },

  removeMember: async (userId: string, data: RemoveGroupMemberInput) => {
    const group = await userGroupRepository.findById(data.groupId);
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
      action: "user_group.member_removed",
      entityType: "user_group",
      entityId: data.groupId,
      metadata: {
        removedUserId: data.userId,
        groupName: group.name,
      },
    });

    await userGroupMemberRepository.remove(data.groupId, data.userId);
  },

  listMembers: async (userId: string, groupId: string) => {
    const group = await userGroupRepository.findById(groupId);
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

    const members = await userGroupMemberRepository.findByGroupId(groupId);
    return members;
  },
};
