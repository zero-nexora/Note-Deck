import { checkBoardPermission } from "@/lib/check-permissions";
import { cardRepository } from "../repositories/card.repository";
import { labelRepository } from "../repositories/label.repository";
import {
  AddCardLabelInput,
  RemoveCardLabelInput,
} from "../schemas/card-label.schema";
import { cardLabelRepository } from "../repositories/card-label.repository";
import { activityRepository } from "../repositories/activity.repository";
import { executeAutomations } from "./automation.service";

export const cardLabelService = {
  add: async (userId: string, data: AddCardLabelInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const label = await labelRepository.findById(data.labelId);
    if (!label) {
      throw new Error("Label not found");
    }

    if (label.boardId !== card.boardId) {
      throw new Error("Label does not belong to this board");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const exists = await cardLabelRepository.findByCardIdAndLabelId(
      data.cardId,
      data.labelId
    );
    if (exists) {
      throw new Error("Label is already added to this card");
    }

    const cardLabel = await cardLabelRepository.add(data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.label_added",
      entityType: "card",
      entityId: card.id,
      metadata: {
        labelId: data.labelId,
        labelName: label.name,
        labelColor: label.color,
        cardTitle: card.title,
      },
    });

    await executeAutomations({
      type: "LABEL_ADDED_TO_CARD",
      boardId: card.boardId,
      cardId: card.id,
      labelId: data.labelId,
      userId,
    });

    return cardLabel;
  },

  remove: async (userId: string, data: RemoveCardLabelInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const label = await labelRepository.findById(data.labelId);
    if (!label) {
      throw new Error("Label not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const exists = await cardLabelRepository.findByCardIdAndLabelId(
      data.cardId,
      data.labelId
    );
    if (!exists) {
      throw new Error("Label is not attached to this card");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.label_removed",
      entityType: "card",
      entityId: card.id,
      metadata: {
        labelId: data.labelId,
        labelName: label.name,
        labelColor: label.color,
        cardTitle: card.title,
      },
    });

    await cardLabelRepository.remove(data.cardId, data.labelId);

    await executeAutomations({
      type: "LABEL_REMOVED_FROM_CARD",
      boardId: card.boardId,
      cardId: card.id,
      labelId: label.id,
      userId,
    });
  },
};
