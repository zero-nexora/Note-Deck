import { activityRepository } from "../repositories/activity.repository";
import { checklistRepository } from "../repositories/checklist.repository";
import { cardRepository } from "../repositories/card.repository";
import {
  CreateChecklistInput,
  UpdateChecklistInput,
} from "../schemas/check-list.schema";
import { checkBoardPermission } from "@/lib/permissions";

export const checklistService = {
  create: async (
    userId: string,
    boardId: string,
    data: CreateChecklistInput
  ) => {
    if (!userId) throw new Error("Unauthenticated");

    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    if (card.boardId !== boardId) {
      throw new Error("Card does not belong to board");
    }

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const checklist = await checklistRepository.create(data);

    await activityRepository.create({
      boardId,
      cardId: checklist.cardId,
      userId,
      action: "checklist.created",
      entityType: "checklist",
      entityId: checklist.id,
      metadata: { title: checklist.title },
    });

    return checklist;
  },

  findById: async (userId: string, id: string) => {
    if (!userId) throw new Error("Unauthenticated");

    const checklist = await checklistRepository.findById(id);
    if (!checklist) throw new Error("Checklist not found");

    return checklist;
  },

  findByCardId: async (userId: string, cardId: string) => {
    const card = await cardRepository.findById(cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "observer"
    );
    
    if (!hasPermission) throw new Error("Permission denied");

    const checklists = await checklistRepository.findByCardId(cardId);

    return checklists;
  },

  update: async (
    userId: string,
    boardId: string,
    id: string,
    data: UpdateChecklistInput
  ) => {
    if (!userId) throw new Error("Unauthenticated");

    const checklist = await checklistRepository.findById(id);
    if (!checklist) throw new Error("Checklist not found");

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await checklistRepository.update(id, data);

    await activityRepository.create({
      boardId,
      cardId: checklist.cardId,
      userId,
      action: "checklist.updated",
      entityType: "checklist",
      entityId: checklist.id,
      metadata: data,
    });

    return updated;
  },

  move: async (
    userId: string,
    boardId: string,
    checklistId: string,
    position: number
  ) => {
    if (!userId) throw new Error("Unauthenticated");

    const checklist = await checklistRepository.findById(checklistId);
    if (!checklist) throw new Error("Checklist not found");

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await checklistRepository.update(checklistId, {
      position,
    });

    await activityRepository.create({
      boardId,
      cardId: checklist.cardId,
      userId,
      action: "checklist.moved",
      entityType: "checklist",
      entityId: checklist.id,
      metadata: { position },
    });

    return updated;
  },

  delete: async (userId: string, boardId: string, id: string) => {
    if (!userId) throw new Error("Unauthenticated");

    const checklist = await checklistRepository.findById(id);
    if (!checklist) throw new Error("Checklist not found");

    const hasPermission = await checkBoardPermission(userId, boardId, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    await checklistRepository.delete(id);

    await activityRepository.create({
      boardId,
      cardId: checklist.cardId,
      userId,
      action: "checklist.deleted",
      entityType: "checklist",
      entityId: checklist.id,
      metadata: { title: checklist.title },
    });
  },
};
