import { activityRepository } from "../repositories/activity.repository";
import { cardMemberRepository } from "../repositories/card-member.repository";

export const cardMemberService = {
  add: async (
    userId: string,
    boardId: string,
    cardId: string,
    memberId: string
  ) => {
    const member = await cardMemberRepository.add(cardId, memberId);

    await activityRepository.create({
      boardId,
      cardId,
      userId,
      action: "card_member.added",
      entityType: "card_member",
      entityId: member.id,
      metadata: { memberId },
    });

    return member;
  },
};
