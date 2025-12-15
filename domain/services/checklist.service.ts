import { activityRepository } from "../repositories/activity.repository";
import { checklistRepository } from "../repositories/checklist.repository";
import { CreateChecklistInput } from "../schemas/check-list.schema";

export const checklistService = {
  create: async (
    userId: string,
    boardId: string,
    data: CreateChecklistInput
  ) => {
    const checklist = await checklistRepository.create(data);

    await activityRepository.create({
      boardId,
      cardId: checklist.cardId,
      userId,
      action: "checklist.created",
      entityType: "checklist",
      entityId: checklist.id,
      metadata: { title: data.title },
    });

    return checklist;
  },
};
