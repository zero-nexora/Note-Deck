import {
  checkBoardPermission,
  // checkUserGroupPermission,
} from "@/lib/check-permissions";
import { activityRepository } from "../repositories/activity.repository";
import { cardMemberRepository } from "../repositories/card-member.repository";
import { cardRepository } from "../repositories/card.repository";
import { userRepository } from "../repositories/user.repository";
import {
  AddCardMemberInput,
  RemoveCardMemberInput,
} from "../schemas/card-member.schema";
import { notificationRepository } from "../repositories/notification.repository";
import {
  ACTIVITY_ACTION,
  ENTITY_TYPE,
  NOTIFICATION_TYPE,
  PERMISSIONS,
  ROLE,
} from "@/lib/constants";

export const cardMemberService = {
  add: async (userId: string, data: AddCardMemberInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );

    // const hasCardAddMemberPermission = await checkUserGroupPermission(
    //   userId,
    //   card.board.workspaceId,
    //   PERMISSIONS.CARD_ASSIGN
    // );

    // if (!hasWorkspaceRoleAccess || !hasCardAddMemberPermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existingMember = await cardMemberRepository.findByCardIdAndUserId(
      data.cardId,
      data.userId
    );
    if (existingMember) {
      throw new Error("User is already assigned to this card");
    }

    const member = await cardMemberRepository.add(data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CARD_MEMBER_ADDED,
      entityType: ENTITY_TYPE.CARD,
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
        type: NOTIFICATION_TYPE.ASSIGNMENT,
        title: "You were assigned to a card",
        message: `You were assigned to "${card.title}"`,
        entityType: ENTITY_TYPE.CARD,
        entityId: card.id,
      });
    }

    return member;
  },

  remove: async (userId: string, data: RemoveCardMemberInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.ADMIN
    );

    // const hasCardRemoveMemberPermission = await checkUserGroupPermission(
    //   userId,
    //   card.board.workspaceId,
    //   PERMISSIONS.CARD_ASSIGN
    // );

    // if (!hasWorkspaceRoleAccess || !hasCardRemoveMemberPermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRoleAccess) {
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
      action: ACTIVITY_ACTION.CARD_MEMBER_REMOVED,
      entityType: ENTITY_TYPE.CARD,
      entityId: card.id,
      metadata: {
        removedUserId: data.userId,
        cardTitle: card.title,
      },
    });

    await cardMemberRepository.remove(data.cardId, data.userId);
  },
};
