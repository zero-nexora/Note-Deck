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
  ReorderCardInput,
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

  move: async (userId: string, data: MoveCardInput) => {
    const card = await cardRepository.findById(data.id);
    if (!card) throw new Error("Card not found");

    const newList = await listRepository.findById(data.listId);
    if (!newList) throw new Error("Target list not found");

    const hasPermissionOld = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    const hasPermissionNew = await checkBoardPermission(
      userId,
      newList.boardId,
      "normal"
    );

    if (!hasPermissionOld || !hasPermissionNew) {
      throw new Error("Permission denied");
    }

    const updated = await cardRepository.update(data.id, {
      listId: data.listId,
      position: data.position,
      boardId: newList.boardId,
    });

    await activityRepository.create({
      boardId: newList.boardId,
      cardId: data.id,
      userId,
      action: "card.moved",
      entityType: "card",
      entityId: data.id,
      metadata: {
        oldListId: card.listId,
        newListId: data.listId,
        oldBoardId: card.boardId,
        newBoardId: newList.boardId,
      },
    });

    if (card.members) {
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

    return updated;
  },

  reorder: async (userId: string, data: ReorderCardInput) => {
    const card = await cardRepository.findById(data.id);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await cardRepository.update(data.id, {
      position: data.position,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: data.id,
      userId,
      action: "card.reordered",
      entityType: "card",
      entityId: data.id,
      metadata: { position: data.position },
    });

    return updated;
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
