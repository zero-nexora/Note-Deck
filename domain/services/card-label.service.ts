import { activityRepository } from "../repositories/activity.repository";
import { cardLabelRepository } from "../repositories/card-label.repository";

export const cardLabelService = {
  add: async (
    userId: string,
    boardId: string,
    cardId: string,
    labelId: string
  ) => {
    const label = await cardLabelRepository.add(cardId, labelId);

    await activityRepository.create({
      boardId,
      cardId,
      userId,
      action: "card_label.added",
      entityType: "card_label",
      entityId: label.id,
      metadata: { labelId },
    });

    return label;
  },
};
