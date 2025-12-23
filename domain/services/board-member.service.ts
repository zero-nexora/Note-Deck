import { boardMemberRepository } from "../repositories/board-member.repository";
import { activityRepository } from "../repositories/activity.repository";
import { CreateBoardMemberInput } from "../schemas/borad-member.schema";

export const boardMemberService = {
  invite: async (userId: string, data: CreateBoardMemberInput) => {
    const member = await boardMemberRepository.addMember(data);

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: "member.added",
      entityType: "board_member",
      entityId: data.boardId,
      metadata: { userId: data.userId, role: data.role },
    });

    return member;
  },
};
