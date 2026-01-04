import { listRepository } from "../repositories/list.repository";
import { boardRepository } from "../repositories/board.repository";
import { activityRepository } from "../repositories/activity.repository";
import { checkBoardPermission } from "@/lib/check-permissions";
import {
  ArchiveListInput,
  CreateListInput,
  DeleteListInput,
  DuplicateListInput,
  MoveListInput,
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

export const listService = {
  create: async (userId: string, data: CreateListInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
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
      boardId: data.boardId,
      userId,
      action: "list.created",
      entityType: "list",
      entityId: list.id,
      metadata: { name: list.name },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "list.created",
      entityType: "list",
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

  update: async (userId: string, id: string, data: UpdateListInput) => {
    const list = await listRepository.findById(id);
    if (!list) {
      throw new Error("List not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
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

    const updated = await listRepository.update(id, updateData);

    const board = await boardRepository.findById(list.boardId);

    const metadata: Record<string, any> = {};
    if (data.name !== undefined) {
      metadata.oldName = list.name;
      metadata.newName = updateData.name;
    }

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: "list.updated",
      entityType: "list",
      entityId: id,
      metadata,
    });

    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "list.updated",
        entityType: "list",
        entityId: id,
        metadata,
      });
    }

    return updated;
  },

  reorders: async (userId: string, data: ReorderListsInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const allLists = await listRepository.findAllByBoardId(data.boardId);
    const boardListIds = new Set(allLists.map((l) => l.id));

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
      action: "lists.reordered",
      entityType: "board",
      entityId: data.boardId,
      metadata: {
        listCount: data.orders.length,
        orders: data.orders,
      },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "lists.reordered",
      entityType: "board",
      entityId: data.boardId,
      metadata: {
        listCount: data.orders.length,
      },
    });
  },

  move: async (userId: string, data: MoveListInput) => {
    const list = await listRepository.findById(data.id);
    if (!list) {
      throw new Error("List not found");
    }

    if (list.boardId === data.boardId) {
      throw new Error("List is already on this board");
    }

    const hasPermissionOld = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
    );
    const hasPermissionNew = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );

    if (!hasPermissionOld || !hasPermissionNew) {
      throw new Error("Permission denied");
    }

    const newBoard = await boardRepository.findById(data.boardId);
    if (!newBoard) {
      throw new Error("Target board not found");
    }

    const updated = await listRepository.update(data.id, {
      boardId: data.boardId,
      position: data.position,
    });

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: "list.moved",
      entityType: "list",
      entityId: data.id,
      metadata: {
        oldBoardId: list.boardId,
        newBoardId: data.boardId,
        listName: list.name,
      },
    });

    const oldBoard = await boardRepository.findById(list.boardId);
    if (oldBoard) {
      await auditLogRepository.create({
        workspaceId: oldBoard.workspaceId,
        userId,
        action: "list.moved_out",
        entityType: "list",
        entityId: data.id,
        metadata: {
          oldBoardId: list.boardId,
          newBoardId: data.boardId,
          listName: list.name,
        },
      });
    }

    await auditLogRepository.create({
      workspaceId: newBoard.workspaceId,
      userId,
      action: "list.moved_in",
      entityType: "list",
      entityId: data.id,
      metadata: {
        oldBoardId: list.boardId,
        newBoardId: data.boardId,
        listName: list.name,
      },
    });

    return updated;
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
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updated = await listRepository.update(data.id, {
      isArchived: true,
    });

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: "list.archived",
      entityType: "list",
      entityId: data.id,
      metadata: { name: list.name },
    });

    const board = await boardRepository.findById(list.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "list.archived",
        entityType: "list",
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

    return updated;
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
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updated = await listRepository.update(data.id, {
      isArchived: false,
    });

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: "list.restored",
      entityType: "list",
      entityId: data.id,
      metadata: { name: list.name },
    });

    const board = await boardRepository.findById(list.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "list.restored",
        entityType: "list",
        entityId: data.id,
        metadata: { boardId: list.boardId, name: list.name },
      });
    }

    return updated;
  },

  delete: async (userId: string, data: DeleteListInput) => {
    const list = await listRepository.findById(data.id);
    if (!list) {
      throw new Error("List not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const board = await boardRepository.findById(list.boardId);

    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: "list.deleted",
      entityType: "list",
      entityId: data.id,
      metadata: { name: list.name },
    });

    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "list.deleted",
        entityType: "list",
        entityId: data.id,
        metadata: { boardId: list.boardId, name: list.name },
      });
    }

    await listRepository.delete(data.id);
  },

  duplicate: async (userId: string, data: DuplicateListInput) => {
    const originalList = await listRepository.findListDetails(data.id);
    if (!originalList) {
      throw new Error("List not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      originalList.boardId,
      "normal"
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
      position: maxPosition + 1024,
    });

    const cardMapping = new Map<string, string>();

    for (const originalCard of originalList.cards) {
      const maxCardPosition = await cardRepository.getMaxPosition(newList.id);

      const newCard = await cardRepository.create({
        listId: newList.id,
        boardId: originalList.boardId,
        title: originalCard.title,
        description: originalCard.description,
        position: maxCardPosition + 1024,
        dueDate: originalCard.dueDate,
        coverImage: originalCard.coverImage,
      });

      cardMapping.set(originalCard.id, newCard.id);

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
      action: "list.duplicated",
      entityType: "list",
      entityId: newList.id,
      metadata: {
        originalListId: originalList.id,
        originalListName: originalList.name,
        newListName: newList.name,
        cardsCount: originalList.cards.length,
      },
    });

    await auditLogRepository.create({
      workspaceId: originalList.board.workspaceId || "",
      userId,
      action: "list.duplicated",
      entityType: "list",
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
