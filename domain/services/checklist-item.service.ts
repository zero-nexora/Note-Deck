import { activityRepository } from "../repositories/activity.repository";
import { checklistItemRepository } from "../repositories/checklist-item.repository";
import { checklistRepository } from "../repositories/checklist.repository";
import { cardRepository } from "../repositories/card.repository";
import {
  CreateChecklistItemInput,
  UpdateChecklistItemInput,
} from "../schemas/check-list-item.schema";
import { checkBoardPermission } from "@/lib/permissions";

export const checklistItemService = {
  create: async (
    userId: string,
    boardId: string,
    data: CreateChecklistItemInput
  ) => {
    const checklist = await checklistRepository.findById(data.checklistId);
    if (!checklist) throw new Error("Checklist not found");

    const card = await cardRepository.findById(checklist.cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Invalid board");
    }

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const item = await checklistItemRepository.create(data);

    await activityRepository.create({
      boardId,
      cardId: card.id,
      userId,
      action: "checklist.item.created",
      entityType: "checklistItem",
      entityId: item.id,
      metadata: { text: item.text },
    });

    return item;
  },

  toggle: async (
    userId: string,
    boardId: string,
    itemId: string,
    isCompleted: boolean
  ) => {
    const item = await checklistItemRepository.findById(itemId);
    if (!item) throw new Error("Checklist item not found");

    const checklist = await checklistRepository.findById(item.checklistId);
    if (!checklist) throw new Error("Checklist not found");

    const card = await cardRepository.findById(checklist.cardId);
    if (!card || card.boardId !== boardId) {
      throw new Error("Invalid board");
    }

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await checklistItemRepository.update(itemId, {
      isCompleted,
    });

    await activityRepository.create({
      boardId,
      cardId: card.id,
      userId,
      action: "checklist.item.toggled",
      entityType: "checklistItem",
      entityId: updated.id,
      metadata: { isCompleted },
    });

    return updated;
  },

  update: async (
    userId: string,
    boardId: string,
    itemId: string,
    data: UpdateChecklistItemInput
  ) => {
    const item = await checklistItemRepository.findById(itemId);
    if (!item) throw new Error("Checklist item not found");

    const checklist = await checklistRepository.findById(item.checklistId);
    const card = await cardRepository.findById(checklist!.cardId);

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await checklistItemRepository.update(itemId, data);

    await activityRepository.create({
      boardId,
      cardId: card!.id,
      userId,
      action: "checklist.item.updated",
      entityType: "checklistItem",
      entityId: updated.id,
      metadata: data,
    });

    return updated;
  },

  delete: async (userId: string, boardId: string, itemId: string) => {
    const item = await checklistItemRepository.findById(itemId);
    if (!item) throw new Error("Checklist item not found");

    const checklist = await checklistRepository.findById(item.checklistId);
    const card = await cardRepository.findById(checklist!.cardId);

    const hasPermission = await checkBoardPermission(userId, boardId, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    await checklistItemRepository.delete(itemId);

    await activityRepository.create({
      boardId,
      cardId: card!.id,
      userId,
      action: "checklist.item.deleted",
      entityType: "checklistItem",
      entityId: itemId,
      metadata: { text: item.text },
    });
  },
};
