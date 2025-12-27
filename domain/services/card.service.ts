import { cardRepository } from "../repositories/card.repository";
import { listRepository } from "../repositories/list.repository";
import { boardRepository } from "../repositories/board.repository";
import { activityRepository } from "../repositories/activity.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { checkBoardPermission } from "@/lib/permissions";
import {
  ArchiveCardInput,
  CreateCardInput,
  DeleteCardInput,
  MoveCardInput,
  ReorderCardsInput,
  RestoreCardInput,
  UpdateCardInput,
} from "../schemas/card.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";

export const cardService = {
  create: async (userId: string, data: CreateCardInput) => {
    const list = await listRepository.findById(data.listId);
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const maxPosition = await cardRepository.getMaxPosition(data.listId);
    const card = await cardRepository.create({
      ...data,
      boardId: list.boardId,
      position: maxPosition + 1,
    });

    await activityRepository.create({
      boardId: list.boardId,
      cardId: card.id,
      userId,
      action: "card.created",
      entityType: "card",
      entityId: card.id,
      metadata: { title: card.title, listId: data.listId },
    });

    const board = await boardRepository.findById(list.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "card.created",
        entityType: "card",
        entityId: card.id,
        metadata: { title: card.title, boardId: list.boardId },
      });
    }

    return card;
  },

  update: async (userId: string, id: string, data: UpdateCardInput) => {
    const card = await cardRepository.findById(id);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (data.title !== undefined && data.title.trim() === "") {
      throw new Error("Card title cannot be empty");
    }

    const updated = await cardRepository.update(id, data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: id,
      userId,
      action: "card.updated",
      entityType: "card",
      entityId: id,
      metadata: data,
    });

    if (data.dueDate && card.members) {
      for (const member of card.members) {
        await notificationRepository.create({
          userId: member.userId,
          type: "due_date",
          title: "Due date updated",
          message: `Due date for "${card.title}" has been updated`,
          entityType: "card",
          entityId: id,
        });
      }
    }

    return updated;
  },

  // Service Layer
  move: async (userId: string, data: MoveCardInput) => {
    // Validate card exists
    const card = await cardRepository.findById(data.id);
    if (!card) throw new Error("Card not found");

    // Validate lists exist
    const sourceList = await listRepository.findById(data.sourceListId);
    const destinationList = await listRepository.findById(
      data.destinationListId
    );

    if (!sourceList || !destinationList) {
      throw new Error("List not found");
    }

    // Check permissions
    const hasPermissionSource = await checkBoardPermission(
      userId,
      sourceList.boardId,
      "normal"
    );
    const hasPermissionDestination = await checkBoardPermission(
      userId,
      destinationList.boardId,
      "normal"
    );

    if (!hasPermissionSource || !hasPermissionDestination) {
      throw new Error("Permission denied");
    }

    const isSameList = data.sourceListId === data.destinationListId;

    if (isSameList) {
      // Same list: Only update positions
      if (data.destinationOrders.length > 0) {
        await cardRepository.reorders(
          data.destinationListId,
          data.destinationOrders
        );
      }
    } else {
      // Different lists: Update card's listId and reorder both lists
      await cardRepository.update(data.id, {
        listId: data.destinationListId,
      });

      // Reorder source list (remove card from source)
      if (data.sourceOrders.length > 0) {
        await cardRepository.reorders(data.sourceListId, data.sourceOrders);
      }

      // Reorder destination list (add card to destination)
      if (data.destinationOrders.length > 0) {
        await cardRepository.reorders(
          data.destinationListId,
          data.destinationOrders
        );
      }

      // Create activity log for cross-list moves
      await activityRepository.create({
        boardId: destinationList.boardId,
        cardId: data.id,
        userId,
        action: "card.moved",
        entityType: "card",
        entityId: data.id,
        metadata: {
          sourceListId: data.sourceListId,
          targetListId: data.destinationListId,
        },
      });

      // Notify card members about the move
      if (card.members?.length) {
        for (const member of card.members) {
          await notificationRepository.create({
            userId: member.userId,
            type: "card_moved",
            title: "Card moved",
            message: `"${card.title}" has been moved to another list`,
            entityType: "card",
            entityId: data.id,
          });
        }
      }
    }

    return card;
  },

  reorders: async (userId: string, data: ReorderCardsInput) => {
    const list = await listRepository.findById(data.listId);
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const allCards = await cardRepository.findAllByListId(data.listId);
    const listCardIds = new Set(allCards.map((c) => c.id));

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
      action: "cards.reordered",
      entityType: "list",
      entityId: data.listId,
      metadata: {
        cardCount: data.orders.length,
        orders: data.orders,
      },
    });
  },

  archive: async (userId: string, data: ArchiveCardInput) => {
    const card = await cardRepository.findById(data.id);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await cardRepository.update(data.id, {
      isArchived: true,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: data.id,
      userId,
      action: "card.archived",
      entityType: "card",
      entityId: data.id,
      metadata: { title: card.title },
    });

    return updated;
  },

  restore: async (userId: string, data: RestoreCardInput) => {
    const card = await cardRepository.findById(data.id);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await cardRepository.update(data.id, {
      isArchived: false,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: data.id,
      userId,
      action: "card.restored",
      entityType: "card",
      entityId: data.id,
      metadata: { title: card.title },
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteCardInput) => {
    const card = await cardRepository.findById(data.id);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    await cardRepository.delete(data.id);

    await activityRepository.create({
      boardId: card.boardId,
      userId,
      action: "card.deleted",
      entityType: "card",
      entityId: data.id,
      metadata: { title: card.title },
    });

    const board = await boardRepository.findById(card.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "card.deleted",
        entityType: "card",
        entityId: data.id,
        metadata: { title: card.title, boardId: card.boardId },
      });
    }
  },
};
