import { activityRepository } from "../repositories/activity.repository";
import { cardMemberRepository } from "../repositories/card-member.repository";
import { cardRepository } from "../repositories/card.repository";
import { CreateCardMemberInput } from "../schemas/card-member.schema";
import { checkBoardPermission } from "@/lib/permissions";

export const cardMemberService = {
  add: async (userId: string, boardId: string, data: CreateCardMemberInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    if (card.boardId !== boardId)
      throw new Error("Card does not belong to board");

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const existed = await cardMemberRepository.find(data.cardId, data.userId);
    if (existed) throw new Error("User already added to card");

    const member = await cardMemberRepository.add(data);

    await activityRepository.create({
      boardId,
      cardId: data.cardId,
      userId,
      action: "card_member.added",
      entityType: "card_member",
      entityId: member.id,
      metadata: { memberId: data.userId },
    });

    return member;
  },

  remove: async (
    userId: string,
    boardId: string,
    cardId: string,
    memberUserId: string
  ) => {
    if (!userId) throw new Error("Unauthenticated");

    const card = await cardRepository.findById(cardId);
    if (!card) throw new Error("Card not found");

    if (card.boardId !== boardId)
      throw new Error("Card does not belong to board");

    const hasPermission = await checkBoardPermission(userId, boardId, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    const existed = await cardMemberRepository.find(cardId, memberUserId);
    if (!existed) throw new Error("Member not found in card");

    await cardMemberRepository.remove(cardId, memberUserId);

    await activityRepository.create({
      boardId,
      cardId,
      userId,
      action: "card_member.removed",
      entityType: "card_member",
      entityId: existed.id,
      metadata: { memberId: memberUserId },
    });
  },
};
