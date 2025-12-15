import { activityRepository } from "../repositories/activity.repository";
import { boardRepository } from "../repositories/board.repository";
import { CreateBoardInput, UpdateBoardInput } from "../schemas/borad.schema";
import { elasticsearchService } from "./elasticsearch.service";

export const boardService = {
  create: async (userId: string, data: CreateBoardInput) => {
    const board = await boardRepository.create(data);

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

  findById: async (boardId: string) => {
    return await boardRepository.findById(boardId);
  },

  findByWorkspaceId: async (workspaceId: string) => {
    return await boardRepository.findByWorkspaceId(workspaceId);
  },

  update: async (userId: string, data: UpdateBoardInput) => {
    const updated = await boardRepository.update(data);

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
};
