import { activityRepository } from "../repositories/activity.repository";
import { listRepository } from "../repositories/list.repository";
import { CreateListInput, UpdateListInput } from "../schemas/list.schema";

export const listService = {
  create: async (userId: string, data: CreateListInput) => {
    const list = await listRepository.create(data);

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

  update: async (userId: string, data: UpdateListInput) => {
    const updated = await listRepository.update(data);

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
    const updated = await listRepository.update(data);

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
};
