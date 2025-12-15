import { activityRepository } from "../repositories/activity.repository";
import { checklistItemRepository } from "../repositories/checklist-item.repository";
import {
  CreateChecklistItemInput,
  UpdateChecklistItemInput,
} from "../schemas/check-list-item.schema";

export const checklistItemService = {
  create: async (
    userId: string,
    boardId: string,
    cardId: string,
    data: CreateChecklistItemInput
  ) => {
    const checklistItem = await checklistItemRepository.create(data);

    await activityRepository.create({
      boardId,
      cardId,
      userId,
      action: "checklist.item.added",
      entityType: "checklistItem",
      entityId: checklistItem.id,
      metadata: { text: data.text },
    });

    return checklistItem;
  },

  toggle: async (
    userId: string,
    boardId: string,
    cardId: string,
    data: UpdateChecklistItemInput
  ) => {
    const updated = await checklistItemRepository.update(data);

    await activityRepository.create({
      boardId,
      cardId,
      userId,
      action: "checklist.item.toggled",
      entityType: "checklistItem",
      entityId: updated.id,
      metadata: { isCompleted: updated.isCompleted },
    });

    return updated;
  },
};
