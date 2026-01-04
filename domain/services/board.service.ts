import { activityRepository } from "../repositories/activity.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { boardMemberRepository } from "../repositories/board-member.repository";
import { boardRepository } from "../repositories/board.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import {
  ArchiveBoardInput,
  CreateBoardInput,
  DeleteBoardInput,
  RestoreBoardInput,
  UpdateBoardInput,
} from "../schemas/board.schema";
// import { elasticsearchService } from "./elasticsearch.service";
import {
  checkBoardPermission,
  checkWorkspacePermission,
} from "@/lib/check-permissions";

export const boardService = {
  create: async (userId: string, data: CreateBoardInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "normal"
    );

    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      throw new Error("Board name cannot be empty");
    }

    const boardData = {
      ...data,
      name: trimmedName,
    };

    const board = await boardRepository.create(boardData);

    await boardMemberRepository.add({
      boardId: board.id,
      userId,
      role: "admin",
    });

    await activityRepository.create({
      boardId: board.id,
      userId,
      action: "board.created",
      entityType: "board",
      entityId: board.id,
      metadata: { name: board.name },
    });

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "board.created",
      entityType: "board",
      entityId: board.id,
      metadata: { name: board.name },
    });

    // await elasticsearchService.indexBoard(board.id);

    return board;
  },

  findById: async (userId: string, boardId: string) => {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      board.id,
      "observer"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    return board;
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

    const boards = await boardRepository.findByWorkspaceId(workspaceId);

    const result = [];
    for (const board of boards) {
      const allowed = await checkBoardPermission(userId, board.id, "observer");
      if (allowed) {
        result.push(board);
      }
    }

    return result;
  },

  update: async (userId: string, id: string, data: UpdateBoardInput) => {
    const board = await boardRepository.findById(id);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(userId, id, "admin");
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        throw new Error("Board name cannot be empty");
      }
      updateData.name = trimmedName;
    }

    const metadata: Record<string, any> = {};
    if (data.name !== undefined && board.name !== updateData.name) {
      metadata.oldName = board.name;
      metadata.newName = updateData.name;
    }
    if (data.description !== undefined) {
      metadata.descriptionUpdated = true;
    }

    if (
      data.name !== undefined &&
      board.name === updateData.name &&
      !data.description
    ) {
      return board;
    }

    const updated = await boardRepository.update(id, updateData);

    await activityRepository.create({
      boardId: updated.id,
      userId,
      action: "board.updated",
      entityType: "board",
      entityId: updated.id,
      metadata,
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "board.updated",
      entityType: "board",
      entityId: id,
      metadata,
    });

    // await elasticsearchService.indexBoard(updated.id);

    return updated;
  },

  delete: async (userId: string, data: DeleteBoardInput) => {
    const board = await boardRepository.findById(data.id);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(userId, data.id, "admin");
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "board.deleted",
      entityType: "board",
      entityId: data.id,
      metadata: { name: board.name },
    });

    await boardRepository.delete(data.id);
  },

  archive: async (userId: string, data: ArchiveBoardInput) => {
    const board = await boardRepository.findById(data.id);
    if (!board) {
      throw new Error("Board not found");
    }

    if (board.isArchived) {
      return board;
    }

    const hasPermission = await checkBoardPermission(userId, data.id, "admin");
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updated = await boardRepository.update(data.id, {
      isArchived: true,
    });

    await activityRepository.create({
      boardId: data.id,
      userId,
      action: "board.archived",
      entityType: "board",
      entityId: data.id,
      metadata: { name: board.name },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "board.archived",
      entityType: "board",
      entityId: data.id,
      metadata: { name: board.name },
    });

    return updated;
  },

  restore: async (userId: string, data: RestoreBoardInput) => {
    const board = await boardRepository.findById(data.id);
    if (!board) {
      throw new Error("Board not found");
    }

    if (!board.isArchived) {
      return board;
    }

    const hasPermission = await checkBoardPermission(userId, data.id, "admin");
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updated = await boardRepository.update(data.id, {
      isArchived: false,
    });

    await activityRepository.create({
      boardId: data.id,
      userId,
      action: "board.restored",
      entityType: "board",
      entityId: data.id,
      metadata: { name: board.name },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "board.restored",
      entityType: "board",
      entityId: data.id,
      metadata: { name: board.name },
    });

    return updated;
  },
};
