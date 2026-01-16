import { canUser } from "@/lib/check-permissions";
import { boardMemberRepository } from "../repositories/board-member.repository";
import { userRepository } from "../repositories/user.repository";
import {
  AddBoardMemberInput,
  ChangeBoardMemberRoleInput,
  ListBoardMembersInput,
  RemoveBoardMemberInput,
} from "../schemas/board-member.schema";
import { boardRepository } from "../repositories/board.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { activityRepository } from "../repositories/activity.repository";
import {
  ACTIVITY_ACTION,
  AUDIT_ACTION,
  DEFAULT_BOARD_MEMBER_ROLE,
  ENTITY_TYPE,
  PERMISSIONS,
  ROLE,
} from "@/lib/constants";

export const boardMemberService = {
  add: async (userId: string, data: AddBoardMemberInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: board.workspaceId,
      boardId: board.id,
      boardRole: ROLE.ADMIN,
      permission: PERMISSIONS.BOARD_MEMBER_ADD,
    });
    if (!allowed) throw new Error("Permission denied");

    const existingMember = await boardMemberRepository.findByBoardIdAndUserId(
      data.boardId,
      data.userId
    );
    if (existingMember) {
      throw new Error("User is already a board member");
    }

    const role = data.role || DEFAULT_BOARD_MEMBER_ROLE;

    const member = await boardMemberRepository.add({
      boardId: data.boardId,
      userId: data.userId,
      role,
    });

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: ACTIVITY_ACTION.BOARD_MEMBER_ADDED,
      entityType: ENTITY_TYPE.BOARD,
      entityId: data.boardId,
      metadata: {
        addedUserId: data.userId,
        addedUserEmail: user.email,
        role,
      },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: AUDIT_ACTION.BOARD_MEMBER_ADDED,
      entityType: ENTITY_TYPE.BOARD,
      entityId: member.id,
      metadata: {
        boardId: data.boardId,
        boardName: board.name,
        addedUserId: data.userId,
        addedUserEmail: user.email,
        role,
      },
    });

    return member;
  },

  remove: async (userId: string, data: RemoveBoardMemberInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: board.workspaceId,
      boardId: board.id,
      boardRole: ROLE.ADMIN,
      permission: PERMISSIONS.BOARD_MEMBER_REMOVE,
    });
    if (!allowed) throw new Error("Permission denied");

    const member = await boardMemberRepository.findByBoardIdAndUserId(
      data.boardId,
      data.userId
    );
    if (!member) {
      throw new Error("User is not a board member");
    }

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: ACTIVITY_ACTION.BOARD_MEMBER_REMOVED,
      entityType: ENTITY_TYPE.BOARD,
      entityId: data.boardId,
      metadata: {
        removedUserId: data.userId,
        removedUserRole: member.role,
      },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: AUDIT_ACTION.BOARD_MEMBER_REMOVED,
      entityType: ENTITY_TYPE.BOARD,
      entityId: member.id,
      metadata: {
        boardId: data.boardId,
        boardName: board.name,
        removedUserId: data.userId,
        removedUserRole: member.role,
      },
    });

    await boardMemberRepository.remove(data.boardId, data.userId);
  },

  changeRole: async (userId: string, data: ChangeBoardMemberRoleInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: board.workspaceId,
      boardId: board.id,
      boardRole: ROLE.ADMIN,
      permission: PERMISSIONS.BOARD_MEMBER_ROLE,
    });
    if (!allowed) throw new Error("Permission denied");

    const member = await boardMemberRepository.findByBoardIdAndUserId(
      data.boardId,
      data.userId
    );
    if (!member) {
      throw new Error("User is not a board member");
    }

    if (member.role === data.role) {
      return member;
    }

    const updatedMember = await boardMemberRepository.updateRole(
      data.boardId,
      data.userId,
      data.role
    );

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: ACTIVITY_ACTION.BOARD_MEMBER_ROLE_CHANGED,
      entityType: ENTITY_TYPE.BOARD,
      entityId: data.boardId,
      metadata: {
        changedUserId: data.userId,
        oldRole: member.role,
        newRole: data.role,
      },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: AUDIT_ACTION.BOARD_MEMBER_ROLE_CHANGED,
      entityType: ENTITY_TYPE.BOARD,
      entityId: member.id,
      metadata: {
        boardId: data.boardId,
        boardName: board.name,
        changedUserId: data.userId,
        oldRole: member.role,
        newRole: data.role,
      },
    });

    return updatedMember;
  },

  list: async (userId: string, data: ListBoardMembersInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: board.workspaceId,
      boardId: board.id,
      boardRole: ROLE.OBSERVER,
    });
    if (!allowed) throw new Error("Permission denied");

    const members = await boardMemberRepository.findByBoardId(data.boardId);
    return members;
  },
};
