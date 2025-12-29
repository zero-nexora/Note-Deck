import { cardMemberRepository } from "../repositories/card-member.repository";
import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import { checkBoardPermission } from "@/lib/permissions";
import {
  AddCardMemberInput,
  RemoveCardMemberInput,
} from "../schemas/card-member.schema";
import { executeAutomations } from "./automation.service";

export const cardMemberService = {
  add: async (userId: string, data: AddCardMemberInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await cardMemberRepository.findByCardIdAndUserId(
      data.cardId,
      data.userId
    );
    if (exists) throw new Error("Member already added");

    const member = await cardMemberRepository.add(data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.member_added",
      entityType: "card",
      entityId: card.id,
      metadata: { memberId: data.userId },
    });

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
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await cardMemberRepository.findByCardIdAndUserId(
      data.cardId,
      data.userId
    );
    if (!exists) throw new Error("Member not found");

    await cardMemberRepository.remove(data.cardId, data.userId);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.member_removed",
      entityType: "card",
      entityId: card.id,
      metadata: { memberId: data.userId },
    });

    await executeAutomations({
      type: "CARD_UNASSIGNED",
      boardId: card.boardId,
      cardId: card.id,
      userId: data.userId,
    });
  },
};
