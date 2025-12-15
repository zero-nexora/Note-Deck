import { Role } from "@/db/enum";
import { boardMemberRepository } from "../repositories/board-member.repository";
import { activityRepository } from "../repositories/activity.repository";

export const boardMemberService = {
  invite: async (
    userId: string,
    boardId: string,
    invitedId: string,
    role: Role
  ) => {
    const member = await boardMemberRepository.addMember(
      boardId,
      invitedId,
      role
    );

    await activityRepository.create({
      boardId,
      userId,
      action: "member.added",
      entityType: "board_member",
      entityId: boardId,
      metadata: { userId: invitedId, role },
    });

    return member;
  },
};
