import { checkBoardPermission } from "@/lib/check-permissions";
import { activityRepository } from "../repositories/activity.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { boardRepository } from "../repositories/board.repository";
import { labelRepository } from "../repositories/label.repository";
import {
  CreateLabelInput,
  DeleteLabelInput,
  UpdateLabelInput,
} from "../schemas/label.schema";

export const labelService = {
  create: async (userId: string, data: CreateLabelInput) => {
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
      throw new Error("Label name cannot be empty");
    }

    const labelData = {
      ...data,
      name: trimmedName,
    };

    const label = await labelRepository.create(labelData);

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
      metadata: { boardId: data.boardId, name: label.name, color: label.color },
    });

    return label;
  },

  update: async (userId: string, id: string, data: UpdateLabelInput) => {
    const label = await labelRepository.findById(id);
    if (!label) {
      throw new Error("Label not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      label.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        throw new Error("Label name cannot be empty");
      }
      updateData.name = trimmedName;
    }

    if (
      data.name !== undefined &&
      label.name === updateData.name &&
      !data.color
    ) {
      return label;
    }

    if (data.color !== undefined && label.color === data.color && !data.name) {
      return label;
    }

    const updated = await labelRepository.update(id, updateData);

    const metadata: Record<string, any> = {};
    if (data.name !== undefined) {
      metadata.oldName = label.name;
      metadata.newName = updateData.name;
    }
    if (data.color !== undefined) {
      metadata.oldColor = label.color;
      metadata.newColor = data.color;
    }

    await activityRepository.create({
      boardId: label.boardId,
      userId,
      action: "label.updated",
      entityType: "label",
      entityId: id,
      metadata,
    });

    const board = await boardRepository.findById(label.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "label.updated",
        entityType: "label",
        entityId: id,
        metadata,
      });
    }

    return updated;
  },

  delete: async (userId: string, data: DeleteLabelInput) => {
    const label = await labelRepository.findById(data.id);
    if (!label) {
      throw new Error("Label not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      label.boardId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const board = await boardRepository.findById(label.boardId);

    await activityRepository.create({
      boardId: label.boardId,
      userId,
      action: "label.deleted",
      entityType: "label",
      entityId: data.id,
      metadata: { name: label.name, color: label.color },
    });

    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "label.deleted",
        entityType: "label",
        entityId: data.id,
        metadata: {
          boardId: label.boardId,
          name: label.name,
          color: label.color,
        },
      });
    }

    await labelRepository.delete(data.id);
  },

  findLabelByBoardId: async (userId: string, boardId: string) => {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const labels = await labelRepository.findByBoardId(boardId);

    return labels;
  },
};
