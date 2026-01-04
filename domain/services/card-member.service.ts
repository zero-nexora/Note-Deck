import { checkBoardPermission } from "@/lib/check-permissions";
import { activityRepository } from "../repositories/activity.repository";
import { cardMemberRepository } from "../repositories/card-member.repository";
import { cardRepository } from "../repositories/card.repository";
import { userRepository } from "../repositories/user.repository";
import {
  AddCardMemberInput,
  RemoveCardMemberInput,
} from "../schemas/card-member.schema";
import { executeAutomations } from "./automation.service";
import { notificationRepository } from "../repositories/notification.repository";

export const cardMemberService = {
  add: async (userId: string, data: AddCardMemberInput) => {
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

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const exists = await cardMemberRepository.findByCardIdAndUserId(
      data.cardId,
      data.userId
    );
    if (exists) {
      throw new Error("User is already assigned to this card");
    }

    const member = await cardMemberRepository.add(data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.member_added",
      entityType: "card",
      entityId: card.id,
      metadata: {
        assignedUserId: data.userId,
        assignedUserEmail: user.email,
        cardTitle: card.title,
      },
    });

    if (data.userId !== userId) {
      await notificationRepository.create({
        userId: data.userId,
        type: "assignment",
        title: "You were assigned to a card",
        message: `You were assigned to "${card.title}"`,
        entityType: "card",
        entityId: card.id,
      });
    }

    await executeAutomations({
      type: "CARD_ASSIGNED",
      boardId: card.boardId,
      cardId: card.id,
      userId: data.userId,
    });

    return member;
  },

  remove: async (userId: string, data: RemoveCardMemberInput) => {
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

    const member = await cardMemberRepository.findByCardIdAndUserId(
      data.cardId,
      data.userId
    );
    if (!member) {
      throw new Error("User is not assigned to this card");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.member_removed",
      entityType: "card",
      entityId: card.id,
      metadata: {
        removedUserId: data.userId,
        cardTitle: card.title,
      },
    });

    await cardMemberRepository.remove(data.cardId, data.userId);

    await executeAutomations({
      type: "CARD_UNASSIGNED",
      boardId: card.boardId,
      cardId: card.id,
      userId: data.userId,
    });
  },
};
