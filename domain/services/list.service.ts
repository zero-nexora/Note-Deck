import { activityRepository } from "../repositories/activity.repository";
import { listRepository } from "../repositories/list.repository";
import { boardRepository } from "../repositories/board.repository";
import { CreateListInput, UpdateListInput } from "../schemas/list.schema";
import { checkBoardPermission } from "@/lib/permissions";

export const listService = {
  create: async (userId: string, data: CreateListInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) throw new Error("Board not found");

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );

    if (!hasPermission) throw new Error("Permission denied");

    const list = await listRepository.create({
      ...data,
      isArchived: false,
    });

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: "list.created",
      entityType: "list",
      entityId: list.id,
      metadata: { name: list.name },
    });

    return list;
  },

  update: async (userId: string, id: string, data: UpdateListInput) => {
    const list = await listRepository.findById(id);
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
    );

    if (!hasPermission) throw new Error("Permission denied");

    const updated = await listRepository.update(id, data);

    await activityRepository.create({
      boardId: updated.boardId,
      userId,
      action: "list.updated",
      entityType: "list",
      entityId: updated.id,
      metadata: data,
    });

    return updated;
  },

  move: async (userId: string, data: { id: string; position: number }) => {
    const list = await listRepository.findById(data.id);
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await listRepository.update(data.id, {
      position: data.position,
    });

    await activityRepository.create({
      boardId: updated.boardId,
      userId,
      action: "list.moved",
      entityType: "list",
      entityId: updated.id,
      metadata: data,
    });

    return updated;
  },

  archive: async (userId: string, id: string) => {
    const list = await listRepository.findById(id);
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const archived = await listRepository.archive(id);

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: "list.archived",
      entityType: "list",
      entityId: list.id,
      metadata: { name: list.name },
    });

    return archived;
  },

  delete: async (userId: string, listId: string) => {
    const list = await listRepository.findById(listId);
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "admin"
    );

    if (!hasPermission) throw new Error("Permission denied");

    await listRepository.delete(list.id);
  },
};
