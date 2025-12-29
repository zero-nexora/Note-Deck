import { listRepository } from "../repositories/list.repository";
import { boardRepository } from "../repositories/board.repository";
import { activityRepository } from "../repositories/activity.repository";
import { checkBoardPermission } from "@/lib/permissions";
import {
  ArchiveListInput,
  CreateListInput,
  DeleteListInput,
  MoveListInput,
  ReorderListsInput,
  RestoreListInput,
  UpdateListInput,
} from "../schemas/list.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { executeAutomations } from "./automation.service";

export const listService = {
  create: async (userId: string, data: CreateListInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) throw new Error("Board not found");

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const maxPosition = await listRepository.getMaxPosition(data.boardId);
    const list = await listRepository.create({
      ...data,
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
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("List name cannot be empty");
    }

    const updated = await listRepository.update(id, data);

    const board = await boardRepository.findById(list.boardId);
    await activityRepository.create({
      boardId: list.boardId,
      userId,
      action: "list.updated",
      entityType: "list",
      entityId: id,
      metadata: data,
    });

    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "list.updated",
        entityType: "list",
        entityId: id,
        metadata: data,
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
    if (!hasPermission) throw new Error("Permission denied");

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
  },

  move: async (userId: string, data: MoveListInput) => {
    const list = await listRepository.findById(data.id);
    if (!list) throw new Error("List not found");

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

    const updated = await listRepository.update(data.id, {
      position: data.position,
    });

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: "list.moved",
      entityType: "list",
      entityId: data.id,
      metadata: { oldBoardId: list.boardId, newBoardId: data.boardId },
    });

    return updated;
  },

  archive: async (userId: string, data: ArchiveListInput) => {
    const list = await listRepository.findById(data.id);
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

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
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

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

    return updated;
  },

  delete: async (userId: string, data: DeleteListInput) => {
    const list = await listRepository.findById(data.id);
    if (!list) throw new Error("List not found");

    const hasPermission = await checkBoardPermission(
      userId,
      list.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    await listRepository.delete(data.id);

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
  },
};
