import { checkBoardPermission } from "@/lib/check-permissions";
import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import { checklistRepository } from "../repositories/checklist.repository";
import {
  CreateChecklistInput,
  DeleteChecklistInput,
  ReorderChecklistInput,
  UpdateChecklistInput,
} from "../schemas/check-list.schema";

export const checklistService = {
  create: async (userId: string, data: CreateChecklistInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedTitle = data.title.trim();
    if (!trimmedTitle) {
      throw new Error("Checklist title cannot be empty");
    }

    const maxPosition = await checklistRepository.getMaxPosition(data.cardId);

    const checklist = await checklistRepository.create({
      ...data,
      title: trimmedTitle,
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
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.title !== undefined) {
      const trimmedTitle = data.title.trim();
      if (!trimmedTitle) {
        throw new Error("Checklist title cannot be empty");
      }
      updateData.title = trimmedTitle;

      if (checklist.title === trimmedTitle) {
        return checklist;
      }
    }

    const updated = await checklistRepository.update(id, updateData);

    const metadata: Record<string, any> = {};
    if (data.title !== undefined) {
      metadata.oldTitle = checklist.title;
      metadata.newTitle = updateData.title;
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "checklist.updated",
      entityType: "checklist",
      entityId: id,
      metadata,
    });

    return updated;
  },

  reorder: async (userId: string, data: ReorderChecklistInput) => {
    const checklist = await checklistRepository.findById(data.id);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    if (checklist.position === data.position) {
      return checklist;
    }

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
      metadata: {
        oldPosition: checklist.position,
        newPosition: data.position,
      },
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteChecklistInput) => {
    const checklist = await checklistRepository.findById(data.id);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "checklist.deleted",
      entityType: "checklist",
      entityId: data.id,
      metadata: { title: checklist.title },
    });

    await checklistRepository.delete(data.id);
  },
};
