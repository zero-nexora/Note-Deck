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
import {
  ACTIVITY_ACTION,
  AUDIT_ACTION,
  ENTITY_TYPE,
  ROLE,
} from "@/lib/constants";

export const labelService = {
  create: async (userId: string, data: CreateLabelInput) => {
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
      throw new Error("Label name cannot be empty");
    }

    const labelData = {
      ...data,
      name: trimmedName,
    };

    const label = await labelRepository.create(labelData);

    await activityRepository.create({
      boardId: board.id,
      userId,
      action: ACTIVITY_ACTION.LABEL_CREATED,
      entityType: ENTITY_TYPE.LABEL,
      entityId: label.id,
      metadata: { name: label.name, color: label.color },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: AUDIT_ACTION.LABEL_CREATED,
      entityType: ENTITY_TYPE.LABEL,
      entityId: label.id,
      metadata: { boardId: data.boardId, name: label.name, color: label.color },
    });

    return label;
  },

  update: async (userId: string, labelId: string, data: UpdateLabelInput) => {
    const label = await labelRepository.findById(labelId);
    if (!label) {
      throw new Error("Label not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      label.boardId,
      ROLE.NORMAL
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

    const updatedLabel = await labelRepository.update(labelId, updateData);

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
      action: ACTIVITY_ACTION.LABEL_UPDATED,
      entityType: ENTITY_TYPE.LABEL,
      entityId: label.id,
      metadata,
    });

    const board = await boardRepository.findById(label.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: AUDIT_ACTION.LABEL_UPDATED,
        entityType: ENTITY_TYPE.LABEL,
        entityId: label.id,
        metadata,
      });
    }

    return updatedLabel;
  },

  delete: async (userId: string, data: DeleteLabelInput) => {
    const label = await labelRepository.findById(data.id);
    if (!label) {
      throw new Error("Label not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      label.boardId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const board = await boardRepository.findById(label.boardId);

    await activityRepository.create({
      boardId: label.boardId,
      userId,
      action: ACTIVITY_ACTION.LABEL_DELETED,
      entityType: ENTITY_TYPE.LABEL,
      entityId: data.id,
      metadata: { name: label.name, color: label.color },
    });

    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: AUDIT_ACTION.LABEL_DELETED,
        entityType: ENTITY_TYPE.LABEL,
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

  findByBoardId: async (userId: string, boardId: string) => {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      boardId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const labels = await labelRepository.findByBoardId(boardId);

    return labels;
  },
};
