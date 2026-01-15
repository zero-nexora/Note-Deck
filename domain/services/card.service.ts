import { cardRepository } from "../repositories/card.repository";
import { listRepository } from "../repositories/list.repository";
import { boardRepository } from "../repositories/board.repository";
import { activityRepository } from "../repositories/activity.repository";
import { notificationRepository } from "../repositories/notification.repository";
import {
  checkBoardPermission,
  // checkUserGroupPermission,
} from "@/lib/check-permissions";
import {
  ArchiveCardInput,
  CreateCardInput,
  DeleteCardInput,
  DuplicateCardInput,
  MoveCardInput,
  ReorderCardsInput,
  RestoreCardInput,
  UpdateCardInput,
} from "../schemas/card.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { cardLabelRepository } from "../repositories/card-label.repository";
import { checklistRepository } from "../repositories/checklist.repository";
import { checklistItemRepository } from "../repositories/checklist-item.repository";
import { attachmentRepository } from "../repositories/attachment.repository";
import {
  ACTIVITY_ACTION,
  AUDIT_ACTION,
  ENTITY_TYPE,
  NOTIFICATION_TYPE,
  PERMISSIONS,
  ROLE,
} from "@/lib/constants";
import { STRIPE_PLANS } from "@/lib/stripe";

export const cardService = {
  create: async (userId: string, data: CreateCardInput) => {
    const list = await listRepository.findById(data.listId);
    if (!list) {
      throw new Error("List not found");
    }

    const board = await boardRepository.findByIdWithWorkspace(list.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const planKey = board.workspace.plan as keyof typeof STRIPE_PLANS;
    const plan = STRIPE_PLANS[planKey];

    if (!plan) {
      throw new Error("Invalid workspace plan");
    }

    const cardLimit = plan.limits.cardsPerBoard;

    if (cardLimit !== -1) {
      const currentCardCount = await cardRepository.countByBoardId(
        list.boardId
      );

      if (currentCardCount >= cardLimit) {
        throw new Error(
          `Card limit reached for ${plan.name} plan (${cardLimit} cards per board)`
        );
      }
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      list.boardId,
      ROLE.ADMIN
    );

    // const hasCardCreatePermission = await checkUserGroupPermission(
    //   userId,
    //   list.boardId,
    //   PERMISSIONS.CARD_CREATE
    // );

    // if (!hasWorkspaceRoleAccess || !hasCardCreatePermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const trimmedTitle = data.title.trim();
    if (!trimmedTitle) {
      throw new Error("Card title cannot be empty");
    }

    const maxPosition = await cardRepository.getMaxPosition(data.listId);

    const card = await cardRepository.create({
      ...data,
      title: trimmedTitle,
      boardId: list.boardId,
      position: maxPosition + 1,
    });

    await activityRepository.create({
      boardId: list.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CARD_CREATED,
      entityType: ENTITY_TYPE.CARD,
      entityId: card.id,
      metadata: { title: card.title, listId: data.listId },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: AUDIT_ACTION.CARD_CREATED,
      entityType: ENTITY_TYPE.CARD,
      entityId: card.id,
      metadata: { title: card.title, boardId: list.boardId },
    });

    return card;
  },

  findById: async (userId: string, cardId: string) => {
    const card =
      await cardRepository.findByIdWithMembersChecklistsCommentsAttachmentsActivitiesAndCardLabels(
        cardId
      );

    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.ADMIN
    );

    // const hasCardViewPermission = await checkUserGroupPermission(
    //   userId,
    //   card.boardId,
    //   PERMISSIONS.CARD_VIEW
    // );

    // if (!hasWorkspaceRoleAccess || !hasCardViewPermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    return card ? card : null;
  },

  update: async (userId: string, cardId: string, data: UpdateCardInput) => {
    const card = await cardRepository.findByIdWithMembers(cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );

    // const hasCardEditPermission = await checkUserGroupPermission(
    //   userId,
    //   card.boardId,
    //   PERMISSIONS.CARD_EDIT
    // );

    // if (!hasWorkspaceRoleAccess || !hasCardEditPermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.title !== undefined) {
      const trimmedTitle = data.title.trim();
      if (!trimmedTitle) {
        throw new Error("Card title cannot be empty");
      }
      updateData.title = trimmedTitle;
    }

    const metadata: Record<string, any> = {};
    if (data.title !== undefined && card.title !== updateData.title) {
      metadata.oldTitle = card.title;
      metadata.newTitle = updateData.title;
    }
    if (data.description !== undefined) {
      metadata.descriptionUpdated = true;
    }
    if (data.dueDate !== undefined) {
      metadata.oldDueDate = card.dueDate;
      metadata.newDueDate = data.dueDate;
    }
    if (data.coverImage !== undefined) {
      metadata.coverImageUpdated = true;
    }

    const updatedCard = await cardRepository.update(cardId, updateData);

    await activityRepository.create({
      boardId: card.boardId,
      cardId,
      userId,
      action: ACTIVITY_ACTION.CARD_UPDATED,
      entityType: ENTITY_TYPE.CARD,
      entityId: card.id,
      metadata,
    });

    if (
      data.dueDate !== undefined &&
      data.dueDate !== card.dueDate &&
      card.members
    ) {
      for (const member of card.members) {
        if (member.userId === userId) continue;

        await notificationRepository.create({
          userId: member.userId,
          type: NOTIFICATION_TYPE.DUE_DATE,
          title: "Due date updated",
          message: `Due date for "${card.title}" has been updated`,
          entityType: ENTITY_TYPE.CARD,
          entityId: card.id,
        });
      }
    }

    return updatedCard;
  },

  move: async (userId: string, data: MoveCardInput) => {
    const card = await cardRepository.findByIdWithMembers(data.id);
    if (!card) {
      throw new Error("Card not found");
    }

    const sourceList = await listRepository.findById(data.sourceListId);
    const destinationList = await listRepository.findById(
      data.destinationListId
    );

    if (!sourceList || !destinationList) {
      throw new Error("List not found");
    }

    const hasWorkspaceRoleAccessSource = await checkBoardPermission(
      userId,
      sourceList.boardId,
      ROLE.NORMAL
    );
    const hasWorkspaceRoleAccessDestination = await checkBoardPermission(
      userId,
      destinationList.boardId,
      ROLE.NORMAL
    );

    // const hasCardMovePermission = await checkUserGroupPermission(
    //   userId,
    //   sourceList.boardId,
    //   PERMISSIONS.CARD_MOVE
    // );

    // if (
    //   !hasWorkspaceRoleAccessSource ||
    //   !hasWorkspaceRoleAccessDestination ||
    //   !hasCardMovePermission
    // ) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRoleAccessSource || !hasWorkspaceRoleAccessDestination) {
      throw new Error("Permission denied");
    }

    const isSameList = data.sourceListId === data.destinationListId;

    if (isSameList) {
      if (data.destinationOrders.length > 0) {
        await cardRepository.reorders(
          data.destinationListId,
          data.destinationOrders
        );
      }
    } else {
      await cardRepository.update(data.id, {
        listId: data.destinationListId,
        boardId: destinationList.boardId,
      });

      if (data.sourceOrders.length > 0) {
        await cardRepository.reorders(data.sourceListId, data.sourceOrders);
      }
      if (data.destinationOrders.length > 0) {
        await cardRepository.reorders(
          data.destinationListId,
          data.destinationOrders
        );
      }

      await activityRepository.create({
        boardId: destinationList.boardId,
        cardId: card.id,
        userId,
        action: ACTIVITY_ACTION.CARD_MOVED,
        entityType: ENTITY_TYPE.CARD,
        entityId: card.id,
        metadata: {
          cardTitle: card.title,
          sourceListId: data.sourceListId,
          destinationListId: data.destinationListId,
          sourceBoardId: sourceList.boardId,
          destinationBoardId: destinationList.boardId,
        },
      });

      if (card.members?.length) {
        for (const member of card.members) {
          if (member.userId === userId) continue;

          await notificationRepository.create({
            userId: member.userId,
            type: NOTIFICATION_TYPE.CARD_MOVED,
            title: "Card moved",
            message: `"${card.title}" has been moved to another list`,
            entityType: ENTITY_TYPE.CARD,
            entityId: card.id,
          });
        }
      }
    }

    return {
      ...card,
      listId: data.destinationListId,
      boardId: destinationList.boardId,
    };
  },

  reorders: async (userId: string, data: ReorderCardsInput) => {
    const list = await listRepository.findById(data.listId);
    if (!list) {
      throw new Error("List not found");
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      list.boardId,
      ROLE.NORMAL
    );
    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const allCards = await cardRepository.findAllByListId(data.listId);
    const listCardIds = new Set(allCards.map((card) => card.id));

    for (const order of data.orders) {
      if (!listCardIds.has(order.id)) {
        throw new Error(
          `Card ${order.id} does not belong to list ${data.listId}`
        );
      }
    }

    await cardRepository.reorders(data.listId, data.orders);

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: ACTIVITY_ACTION.CARDS_REORDERED,
      entityType: ENTITY_TYPE.LIST,
      entityId: data.listId,
      metadata: {
        cardCount: data.orders.length,
      },
    });
  },

  archive: async (userId: string, data: ArchiveCardInput) => {
    const card = await cardRepository.findById(data.id);
    if (!card) {
      throw new Error("Card not found");
    }

    if (card.isArchived) {
      return card;
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );
    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const updatedCard = await cardRepository.update(data.id, {
      isArchived: true,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CARD_ARCHIVED,
      entityType: ENTITY_TYPE.CARD,
      entityId: data.id,
      metadata: { title: card.title },
    });

    return updatedCard;
  },

  restore: async (userId: string, data: RestoreCardInput) => {
    const card = await cardRepository.findById(data.id);
    if (!card) {
      throw new Error("Card not found");
    }

    if (!card.isArchived) {
      return card;
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );
    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const updatedCard = await cardRepository.update(data.id, {
      isArchived: false,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CARD_RESTORED,
      entityType: ENTITY_TYPE.CARD,
      entityId: card.id,
      metadata: { title: card.title },
    });

    return updatedCard;
  },

  delete: async (userId: string, data: DeleteCardInput) => {
    const card = await cardRepository.findById(data.id);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.ADMIN
    );

    // const hasCardDeletePermission = await checkUserGroupPermission(
    //   userId,
    //   card.boardId,
    //   PERMISSIONS.CARD_DELETE
    // );

    // if (!hasWorkspaceRoleAccess || !hasCardDeletePermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const board = await boardRepository.findById(card.boardId);

    await activityRepository.create({
      boardId: card.boardId,
      userId,
      action: ACTIVITY_ACTION.CARD_DELETED,
      entityType: ENTITY_TYPE.CARD,
      entityId: data.id,
      metadata: { title: card.title, listId: card.listId },
    });

    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: AUDIT_ACTION.CARD_DELETED,
        entityType: ENTITY_TYPE.CARD,
        entityId: data.id,
        metadata: { title: card.title, boardId: card.boardId },
      });
    }

    await cardRepository.delete(data.id);
  },

  duplicate: async (userId: string, data: DuplicateCardInput) => {
    const originalCard =
      await cardRepository.findByIdWithBoardCardLabelsChecklistsAttachments(
        data.id
      );
    if (!originalCard) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      originalCard.boardId,
      ROLE.NORMAL
    );
    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const maxPosition = await cardRepository.getMaxPosition(
      originalCard.listId
    );

    const newCard = await cardRepository.create({
      listId: originalCard.listId,
      boardId: originalCard.boardId,
      title: `${originalCard.title} (Copy)`,
      description: originalCard.description,
      position: maxPosition + 1,
      dueDate: originalCard.dueDate,
      coverImage: originalCard.coverImage,
    });

    for (const cardLabel of originalCard.cardLabels) {
      await cardLabelRepository.add({
        cardId: newCard.id,
        labelId: cardLabel.labelId,
      });
    }

    for (const checklist of originalCard.checklists) {
      const newChecklist = await checklistRepository.create({
        cardId: newCard.id,
        title: checklist.title,
        position: checklist.position,
      });

      for (const item of checklist.items) {
        await checklistItemRepository.create({
          checklistId: newChecklist.id,
          text: item.text,
          position: item.position,
          isCompleted: false,
        });
      }
    }

    for (const attachment of originalCard.attachments) {
      await attachmentRepository.create({
        cardId: newCard.id,
        userId: userId,
        fileName: attachment.fileName,
        fileUrl: attachment.fileUrl,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        uploadThingKey: attachment.uploadThingKey,
        expiresAt: attachment.expiresAt || undefined,
      });
    }

    await activityRepository.create({
      boardId: originalCard.boardId,
      cardId: newCard.id,
      userId,
      action: ACTIVITY_ACTION.CARD_DUPLICATED,
      entityType: ENTITY_TYPE.CARD,
      entityId: newCard.id,
      metadata: {
        originalCardId: originalCard.id,
        originalCardTitle: originalCard.title,
        newCardTitle: newCard.title,
        checklistsCount: originalCard.checklists.length,
        attachmentsCount: originalCard.attachments.length,
        labelsCount: originalCard.cardLabels.length,
      },
    });

    if (originalCard.board) {
      await auditLogRepository.create({
        workspaceId: originalCard.board.workspaceId,
        userId,
        action: AUDIT_ACTION.CARD_DUPLICATED,
        entityType: ENTITY_TYPE.CARD,
        entityId: newCard.id,
        metadata: {
          originalCardId: originalCard.id,
          originalCardTitle: originalCard.title,
          newCardTitle: newCard.title,
          listId: originalCard.listId,
        },
      });
    }

    return newCard;
  },
};
