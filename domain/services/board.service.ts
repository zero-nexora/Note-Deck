import { activityRepository } from "../repositories/activity.repository";
import { boardMemberRepository } from "../repositories/board-member.repository";
import { boardRepository } from "../repositories/board.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import { CreateBoardInput, UpdateBoardInput } from "../schemas/borad.schema";
import { elasticsearchService } from "./elasticsearch.service";
import {
  checkBoardPermission,
  checkWorkspacePermission,
} from "@/lib/permissions";

export const boardService = {
  create: async (userId: string, data: CreateBoardInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "normal"
    );

    if (!hasPermission) throw new Error("Permission denied");

    const board = await boardRepository.create({
      ...data,
      isArchived: false,
    });

    await boardMemberRepository.addMember({
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

    await elasticsearchService.indexBoard(board.id);

    return board;
  },

  findById: async (userId: string, boardId: string) => {
    const board = await boardRepository.findById(boardId);
    if (!board) throw new Error("Board not found");

    const hasPermission = await checkBoardPermission(
      userId,
      board.id,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    return board;
  },

  findByWorkspaceId: async (userId: string, workspaceId: string) => {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const boards = await boardRepository.findByWorkspaceId(workspaceId);

    const result = [];
    for (const board of boards) {
      const allowed = await checkBoardPermission(userId, board.id, "observer");
      if (allowed) result.push(board);
    }

    return result;
  },

  update: async (userId: string, id: string, data: UpdateBoardInput) => {
    const board = await boardRepository.findById(id);
    if (!board) throw new Error("Board not found");

    const hasPermission = await checkBoardPermission(userId, board.id, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const allowed = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!allowed) throw new Error("Permission denied");

    const updated = await boardRepository.update(id, data);

    await activityRepository.create({
      boardId: updated.id,
      userId,
      action: "board.updated",
      entityType: "board",
      entityId: updated.id,
      metadata: data,
    });

    await elasticsearchService.indexBoard(updated.id);

    return updated;
  },

  delete: async (userId: string, id: string) => {
    const board = await boardRepository.findById(id);
    if (!board) throw new Error("Board not found");

    const hasPermission = await checkBoardPermission(userId, board.id, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    await boardRepository.delete(board.id);

    // await activityRepository.create({
    //   boardId: board.id,
    //   userId,
    //   action: "board.deleted",
    //   entityType: "board",
    //   entityId: "",
    //   metadata: { name: board.name },
    // });
  },

  archive: async (userId: string, id: string) => {
    const board = await boardRepository.findById(id);
    if (!board) throw new Error("Board not found");

    const hasPermission = await checkBoardPermission(userId, board.id, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    const archived = await boardRepository.archive(board.id);

    await activityRepository.create({
      boardId: board.id,
      userId,
      action: "board.archived",
      entityType: "board",
      entityId: board.id,
      metadata: { name: board.name },
    });

    return archived;
  },
};
