import { listRepository } from "../repositories/list.repository";
import { boardRepository } from "../repositories/board.repository";
import { activityRepository } from "../repositories/activity.repository";
import { checkBoardPermission } from "@/lib/check-permissions";
import {
  ArchiveListInput,
  CreateListInput,
  DeleteListInput,
  DuplicateListInput,
  ReorderListsInput,
  RestoreListInput,
  UpdateListInput,
} from "../schemas/list.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { executeAutomations } from "./automation.service";
import { cardRepository } from "../repositories/card.repository";
import { cardLabelRepository } from "../repositories/card-label.repository";
import { checklistRepository } from "../repositories/checklist.repository";
import { checklistItemRepository } from "../repositories/checklist-item.repository";
import { attachmentRepository } from "../repositories/attachment.repository";
import {
  ACTIVITY_ACTION,
  AUDIT_ACTION,
  ENTITY_TYPE,
  ROLE,
} from "@/lib/constants";

export const listService = {
  create: async (userId: string, data: CreateListInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      throw new Error("List name cannot be empty");
    }

    const maxPosition = await listRepository.getMaxPosition(data.boardId);

    const list = await listRepository.create({
      ...data,
      name: trimmedName,
      position: maxPosition + 1,
    });

    await activityRepository.create({
      boardId: board.id,
      userId,
      action: ACTIVITY_ACTION.LIST_CREATED,
      entityType: ENTITY_TYPE.LIST,
      entityId: list.id,
      metadata: { name: list.name },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: AUDIT_ACTION.LIST_CREATED,
      entityType: ENTITY_TYPE.LIST,
      entityId: list.id,
      metadata: { boardId: data.boardId, name: list.name },
    });

    await executeAutomations({
      type: "LIST_CREATED",
      boardId: data.boardId,
      listId: list.id,
      userId,
    });

    return list;
  },

  update: async (userId: string, listId: string, data: UpdateListInput) => {
    const list = await listRepository.findById(listId);
    if (!list) {
      throw new Error("List not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        throw new Error("List name cannot be empty");
      }
      updateData.name = trimmedName;

      if (list.name === trimmedName) {
        return list;
      }
    }

    const updatedList = await listRepository.update(listId, updateData);

    const board = await boardRepository.findById(list.boardId);

    const metadata: Record<string, any> = {};
    if (data.name !== undefined) {
      metadata.oldName = list.name;
      metadata.newName = updateData.name;
    }

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: ACTIVITY_ACTION.LIST_UPDATED,
      entityType: ENTITY_TYPE.LIST,
      entityId: list.id,
      metadata,
    });

    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: AUDIT_ACTION.LIST_UPDATED,
        entityType: ENTITY_TYPE.LIST,
        entityId: list.id,
        metadata,
      });
    }

    return updatedList;
  },

  reorders: async (userId: string, data: ReorderListsInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const allLists = await listRepository.findAllByBoardId(data.boardId);
    const boardListIds = new Set(allLists.map((list) => list.id));

    for (const order of data.orders) {
      if (!boardListIds.has(order.id)) {
        throw new Error(
          `List ${order.id} does not belong to board ${data.boardId}`
        );
      }
    }

    await listRepository.reorders(data.boardId, data.orders);

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: ACTIVITY_ACTION.LISTS_REORDERED,
      entityType: ENTITY_TYPE.BOARD,
      entityId: data.boardId,
      metadata: {
        listCount: data.orders.length,
        orders: data.orders,
      },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: AUDIT_ACTION.LISTS_REORDERED,
      entityType: ENTITY_TYPE.BOARD,
      entityId: data.boardId,
      metadata: {
        listCount: data.orders.length,
      },
    });
  },

  archive: async (userId: string, data: ArchiveListInput) => {
    const list = await listRepository.findById(data.id);
    if (!list) {
      throw new Error("List not found");
    }

    if (list.isArchived) {
      return list;
    }

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updatedList = await listRepository.update(data.id, {
      isArchived: true,
    });

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: ACTIVITY_ACTION.LIST_ARCHIVED,
      entityType: ENTITY_TYPE.LIST,
      entityId: data.id,
      metadata: { name: list.name },
    });

    const board = await boardRepository.findById(list.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: AUDIT_ACTION.LIST_ARCHIVED,
        entityType: ENTITY_TYPE.LIST,
        entityId: data.id,
        metadata: { boardId: list.boardId, name: list.name },
      });
    }

    await executeAutomations({
      type: "LIST_ARCHIVED",
      boardId: list.boardId,
      listId: list.id,
      userId,
    });

    return updatedList;
  },

  restore: async (userId: string, data: RestoreListInput) => {
    const list = await listRepository.findById(data.id);
    if (!list) {
      throw new Error("List not found");
    }

    if (!list.isArchived) {
      return list;
    }

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updatedList = await listRepository.update(data.id, {
      isArchived: false,
    });

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: ACTIVITY_ACTION.LIST_RESTORED,
      entityType: ENTITY_TYPE.LIST,
      entityId: data.id,
      metadata: { name: list.name },
    });

    const board = await boardRepository.findById(list.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: AUDIT_ACTION.LIST_RESTORED,
        entityType: ENTITY_TYPE.LIST,
        entityId: data.id,
        metadata: { boardId: list.boardId, name: list.name },
      });
    }

    return updatedList;
  },

  delete: async (userId: string, data: DeleteListInput) => {
    const list = await listRepository.findById(data.id);
    if (!list) {
      throw new Error("List not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const board = await boardRepository.findById(list.boardId);

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: ACTIVITY_ACTION.LIST_DELETED,
      entityType: ENTITY_TYPE.LIST,
      entityId: data.id,
      metadata: { name: list.name },
    });

    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: AUDIT_ACTION.LIST_DELETED,
        entityType: ENTITY_TYPE.LIST,
        entityId: data.id,
        metadata: { boardId: list.boardId, name: list.name },
      });
    }

    await listRepository.delete(data.id);
  },

  duplicate: async (userId: string, data: DuplicateListInput) => {
    const originalList = await listRepository.findListWithCardsAndBoard(
      data.id
    );
    if (!originalList) {
      throw new Error("List not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      originalList.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const maxPosition = await listRepository.getMaxPosition(
      originalList.boardId
    );

    const newList = await listRepository.create({
      boardId: originalList.boardId,
      name: `${originalList.name} (Copy)`,
      position: maxPosition + 1,
    });

    for (const originalCard of originalList.cards) {
      const maxCardPosition = await cardRepository.getMaxPosition(newList.id);

      const newCard = await cardRepository.create({
        listId: newList.id,
        boardId: originalList.boardId,
        title: originalCard.title,
        description: originalCard.description,
        position: maxCardPosition + 1,
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
    }

    await activityRepository.create({
      boardId: originalList.boardId,
      userId,
      action: ACTIVITY_ACTION.LIST_DUPLICATED,
      entityType: ENTITY_TYPE.LIST,
      entityId: newList.id,
      metadata: {
        originalListId: originalList.id,
        originalListName: originalList.name,
        newListName: newList.name,
        cardsCount: originalList.cards.length,
      },
    });

    await auditLogRepository.create({
      workspaceId: originalList.board.workspaceId,
      userId,
      action: AUDIT_ACTION.LIST_DUPLICATED,
      entityType: ENTITY_TYPE.LIST,
      entityId: newList.id,
      metadata: {
        originalListId: originalList.id,
        originalListName: originalList.name,
        newListName: newList.name,
        cardsCount: originalList.cards.length,
      },
    });

    return newList;
  },
};
