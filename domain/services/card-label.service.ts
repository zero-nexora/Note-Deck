import { cardLabelRepository } from "../repositories/card-label.repository";
import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import { labelRepository } from "../repositories/label.repository";
import { checkBoardPermission } from "@/lib/permissions";
import {
  AddCardLabelInput,
  RemoveCardLabelInput,
} from "../schemas/card-label.schema";

export const cardLabelService = {
  add: async (userId: string, data: AddCardLabelInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    const label = await labelRepository.findById(data.labelId);
    if (!label) throw new Error("Label not found");

    if (label.boardId !== card.boardId) {
      throw new Error("Label does not belong to this board");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await cardLabelRepository.findByCardIdAndLabelId(
      data.cardId,
      data.labelId
    );
    if (exists) throw new Error("Label already added");

    const cardLabel = await cardLabelRepository.add(data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.label_added",
      entityType: "card",
      entityId: card.id,
      metadata: { labelId: data.labelId, labelName: label.name },
    });

    return cardLabel;
  },

  remove: async (userId: string, data: RemoveCardLabelInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await cardLabelRepository.findByCardIdAndLabelId(
      data.cardId,
      data.labelId
    );
    if (!exists) throw new Error("Label not found");

    await cardLabelRepository.remove(data.cardId, data.labelId);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.label_removed",
      entityType: "card",
      entityId: card.id,
      metadata: { labelId: data.labelId },
    });
  },
};
