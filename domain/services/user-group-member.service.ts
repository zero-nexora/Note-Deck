import { checkWorkspacePermission } from "@/lib/permissions";
import { userGroupRepository } from "../repositories/user-group.repository";
import {
  AddGroupMemberInput,
  RemoveGroupMemberInput,
} from "../schemas/user-group-member.schema";
import { userGroupMemberRepository } from "../repositories/user-group-member.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";

export const userGroupMemberService = {
  addMember: async (userId: string, data: AddGroupMemberInput) => {
    const group = await userGroupRepository.findById(data.groupId);
    if (!group) throw new Error("Group not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      group.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await userGroupMemberRepository.findByGroupIdAndUserId(
      data.groupId,
      data.userId
    );
    if (exists) throw new Error("User already in group");

    const member = await userGroupMemberRepository.add(data);

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: "user_group.member_added",
      entityType: "user_group",
      entityId: data.groupId,
      metadata: { addedUserId: data.userId },
    });

    return member;
  },

  removeMember: async (userId: string, data: RemoveGroupMemberInput) => {
    const group = await userGroupRepository.findById(data.groupId);
    if (!group) throw new Error("Group not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      group.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await userGroupMemberRepository.findByGroupIdAndUserId(
      data.groupId,
      data.userId
    );
    if (!exists) throw new Error("User not in group");

    await userGroupMemberRepository.remove(data.groupId, data.userId);

    await auditLogRepository.create({
      workspaceId: group.workspaceId,
      userId,
      action: "user_group.member_removed",
      entityType: "user_group",
      entityId: data.groupId,
      metadata: { removedUserId: data.userId },
    });
  },
};
