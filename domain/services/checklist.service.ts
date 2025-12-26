import { checklistRepository } from "../repositories/checklist.repository";
import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import { checkBoardPermission } from "@/lib/permissions";
import {
  CreateChecklistInput,
  DeleteChecklistInput,
  ReorderChecklistInput,
  UpdateChecklistInput,
} from "../schemas/check-list.schema";

export const checklistService = {
  create: async (userId: string, data: CreateChecklistInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const maxPosition = await checklistRepository.getMaxPosition(data.cardId);
    const checklist = await checklistRepository.create({
      ...data,
      position: maxPosition + 1,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "checklist.created",
      entityType: "checklist",
      entityId: checklist.id,
      metadata: { title: checklist.title },
    });

    return checklist;
  },

  update: async (userId: string, id: string, data: UpdateChecklistInput) => {
    const checklist = await checklistRepository.findById(id);
    if (!checklist) throw new Error("Checklist not found");

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (data.title !== undefined && data.title.trim() === "") {
      throw new Error("Checklist title cannot be empty");
    }

    const updated = await checklistRepository.update(id, data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "checklist.updated",
      entityType: "checklist",
      entityId: id,
      metadata: data,
    });

    return updated;
  },

  reorder: async (userId: string, data: ReorderChecklistInput) => {
    const checklist = await checklistRepository.findById(data.id);
    if (!checklist) throw new Error("Checklist not found");

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await checklistRepository.update(data.id, {
      position: data.position,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "checklist.reordered",
      entityType: "checklist",
      entityId: data.id,
      metadata: { position: data.position },
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteChecklistInput) => {
    const checklist = await checklistRepository.findById(data.id);
    if (!checklist) throw new Error("Checklist not found");

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    await checklistRepository.delete(data.id);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "checklist.deleted",
      entityType: "checklist",
      entityId: data.id,
      metadata: { title: checklist.title },
    });
  },
};
