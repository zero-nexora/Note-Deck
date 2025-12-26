import { labelRepository } from "../repositories/label.repository";
import { boardRepository } from "../repositories/board.repository";
import { activityRepository } from "../repositories/activity.repository";
import { checkBoardPermission } from "@/lib/permissions";
import {
  CreateLabelInput,
  DeleteLabelInput,
  UpdateLabelInput,
} from "../schemas/label.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";

export const labelService = {
  create: async (userId: string, data: CreateLabelInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) throw new Error("Board not found");

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const label = await labelRepository.create(data);

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: "label.created",
      entityType: "label",
      entityId: label.id,
      metadata: { name: label.name, color: label.color },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "label.created",
      entityType: "label",
      entityId: label.id,
      metadata: { boardId: data.boardId, name: label.name },
    });

    return label;
  },

  update: async (userId: string, id: string, data: UpdateLabelInput) => {
    const label = await labelRepository.findById(id);
    if (!label) throw new Error("Label not found");

    const hasPermission = await checkBoardPermission(
      userId,
      label.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("Label name cannot be empty");
    }

    const updated = await labelRepository.update(id, data);

    await activityRepository.create({
      boardId: label.boardId,
      userId,
      action: "label.updated",
      entityType: "label",
      entityId: id,
      metadata: data,
    });

    const board = await boardRepository.findById(label.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "label.updated",
        entityType: "label",
        entityId: id,
        metadata: data,
      });
    }

    return updated;
  },

  delete: async (userId: string, data: DeleteLabelInput) => {
    const label = await labelRepository.findById(data.id);
    if (!label) throw new Error("Label not found");

    const hasPermission = await checkBoardPermission(
      userId,
      label.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    await labelRepository.delete(data.id);

    await activityRepository.create({
      boardId: label.boardId,
      userId,
      action: "label.deleted",
      entityType: "label",
      entityId: data.id,
      metadata: { name: label.name },
    });

    const board = await boardRepository.findById(label.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "label.deleted",
        entityType: "label",
        entityId: data.id,
        metadata: { boardId: label.boardId, name: label.name },
      });
    }
  },
};
