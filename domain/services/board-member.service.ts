import {
  checkBoardPermission,
  checkWorkspacePermission,
} from "@/lib/check-permissions";
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

export const boardMemberService = {
  add: async (userId: string, data: AddBoardMemberInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isWorkspaceMember = await checkWorkspacePermission(
      data.userId,
      board.workspaceId,
      "observer"
    );
    if (!isWorkspaceMember) {
      throw new Error("User must be a workspace member first");
    }

    const exists = await boardMemberRepository.findByBoardIdAndUserId(
      data.boardId,
      data.userId
    );
    if (exists) {
      throw new Error("User is already a board member");
    }

    const role = data.role || "normal";

    const member = await boardMemberRepository.add({
      boardId: data.boardId,
      userId: data.userId,
      role,
    });

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: "board.member_added",
      entityType: "board",
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
      action: "board.member_added",
      entityType: "board_member",
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

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

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
      action: "board.member_removed",
      entityType: "board",
      entityId: data.boardId,
      metadata: {
        removedUserId: data.userId,
        removedUserRole: member.role,
      },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "board.member_removed",
      entityType: "board_member",
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

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

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

    const updated = await boardMemberRepository.updateRole(
      data.boardId,
      data.userId,
      data.role
    );

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: "board.member_role_changed",
      entityType: "board",
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
      action: "board.member_role_changed",
      entityType: "board_member",
      entityId: member.id,
      metadata: {
        boardId: data.boardId,
        boardName: board.name,
        changedUserId: data.userId,
        oldRole: member.role,
        newRole: data.role,
      },
    });

    return updated;
  },

  list: async (userId: string, data: ListBoardMembersInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "observer"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const members = await boardMemberRepository.findByBoardId(data.boardId);
    return members;
  },
};
