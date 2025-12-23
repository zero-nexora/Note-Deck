import { activityRepository } from "../repositories/activity.repository";
import { cardLabelRepository } from "../repositories/card-label.repository";
import { cardRepository } from "../repositories/card.repository";
import { labelRepository } from "../repositories/label.repository";
import { checkBoardPermission } from "@/lib/permissions";
import { CreateCardLabelInput } from "../schemas/card-label.schema";

export const cardLabelService = {
  add: async (
    userId: string,
    boardId: string,
    data: CreateCardLabelInput
  ) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");
    if (card.boardId !== boardId)
      throw new Error("Card does not belong to board");

    const label = await labelRepository.findById(data.labelId);
    if (!label) throw new Error("Label not found");
    if (label.boardId !== boardId)
      throw new Error("Label does not belong to board");

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const existed = await cardLabelRepository.find(data.cardId, data.labelId);
    if (existed) throw new Error("Label already attached to card");

    const cardLabel = await cardLabelRepository.create(data);

    await activityRepository.create({
      boardId,
      cardId: data.cardId,
      userId,
      action: "card_label.added",
      entityType: "card_label",
      entityId: cardLabel.id,
      metadata: { labelId: data.labelId },
    });

    return cardLabel;
  },

  remove: async (
    userId: string,
    boardId: string,
    cardId: string,
    labelId: string
  ) => {
    const card = await cardRepository.findById(cardId);
    if (!card) throw new Error("Card not found");
    if (card.boardId !== boardId)
      throw new Error("Card does not belong to board");

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const existed = await cardLabelRepository.find(cardId, labelId);
    if (!existed) throw new Error("Label not attached to card");

    await cardLabelRepository.remove(cardId, labelId);

    await activityRepository.create({
      boardId,
      cardId,
      userId,
      action: "card_label.removed",
      entityType: "card_label",
      entityId: existed.id,
      metadata: { labelId },
    });
  },
};
