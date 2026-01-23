import { canUser } from "@/lib/check-permissions";
import { cardRepository } from "../repositories/card.repository";
import { labelRepository } from "../repositories/label.repository";
import {
  AddCardLabelInput,
  RemoveCardLabelInput,
} from "../schemas/card-label.schema";
import { cardLabelRepository } from "../repositories/card-label.repository";
import { activityRepository } from "../repositories/activity.repository";
import {
  ACTIVITY_ACTION,
  ENTITY_TYPE,
  PERMISSIONS,
  ROLE,
} from "@/lib/constants";

export const cardLabelService = {
  add: async (userId: string, data: AddCardLabelInput) => {
    const card = await cardRepository.findByIdWithBoard(data.cardId);
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

    const allowed = await canUser(userId, {
      workspaceId: card.board.workspaceId,
      boardId: card.boardId,
      boardRole: ROLE.NORMAL,
      permission: PERMISSIONS.CARD_LABEL_ADD,
    });
    if (!allowed) throw new Error("Permission denied");

    const existingCardLabel = await cardLabelRepository.findByCardIdAndLabelId(
      data.cardId,
      data.labelId
    );
    if (existingCardLabel) {
      throw new Error("Label is already added to this card");
    }

    const cardLabel = await cardLabelRepository.addWithLabel(data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CARD_LABEL_ADDED,
      entityType: ENTITY_TYPE.CARD,
      entityId: card.id,
      metadata: {
        labelId: data.labelId,
        labelName: label.name,
        labelColor: label.color,
        cardTitle: card.title,
      },
    });

    return cardLabel;
  },

  remove: async (userId: string, data: RemoveCardLabelInput) => {
    const card = await cardRepository.findByIdWithBoard(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const label = await labelRepository.findById(data.labelId);
    if (!label) {
      throw new Error("Label not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: card.board.workspaceId,
      boardId: card.boardId,
      boardRole: ROLE.NORMAL,
      permission: PERMISSIONS.CARD_LABEL_REMOVE,
    });
    if (!allowed) throw new Error("Permission denied");

    const existingCardLabel = await cardLabelRepository.findByCardIdAndLabelId(
      data.cardId,
      data.labelId
    );
    if (!existingCardLabel) {
      throw new Error("Label is not attached to this card");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CARD_LABEL_REMOVED,
      entityType: ENTITY_TYPE.CARD,
      entityId: card.id,
      metadata: {
        labelId: data.labelId,
        labelName: label.name,
        labelColor: label.color,
        cardTitle: card.title,
      },
    });

    await cardLabelRepository.remove(data.cardId, data.labelId);
  },
};
