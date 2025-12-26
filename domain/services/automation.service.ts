import { automationRepository } from "../repositories/automation.repository";
import { boardRepository } from "../repositories/board.repository";
import { activityRepository } from "../repositories/activity.repository";
import { checkBoardPermission } from "@/lib/permissions";
import {
  CreateAutomationInput,
  DeleteAutomationInput,
  DisableAutomationInput,
  EnableAutomationInput,
  UpdateAutomationInput,
} from "../schemas/automation.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";

export const automationService = {
  create: async (userId: string, data: CreateAutomationInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) throw new Error("Board not found");

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const automation = await automationRepository.create(data);

    await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: "automation.created",
      entityType: "automation",
      entityId: automation.id,
      metadata: { name: automation.name },
    });

    await auditLogRepository.create({
      workspaceId: board.workspaceId,
      userId,
      action: "automation.created",
      entityType: "automation",
      entityId: automation.id,
      metadata: { boardId: data.boardId, name: automation.name },
    });

    return automation;
  },

  update: async (userId: string, id: string, data: UpdateAutomationInput) => {
    const automation = await automationRepository.findById(id);
    if (!automation) throw new Error("Automation not found");

    const hasPermission = await checkBoardPermission(
      userId,
      automation.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("Automation name cannot be empty");
    }

    const updated = await automationRepository.update(id, data);

    await activityRepository.create({
      boardId: automation.boardId,
      userId,
      action: "automation.updated",
      entityType: "automation",
      entityId: id,
      metadata: data,
    });

    return updated;
  },

  enable: async (userId: string, data: EnableAutomationInput) => {
    const automation = await automationRepository.findById(data.id);
    if (!automation) throw new Error("Automation not found");

    const hasPermission = await checkBoardPermission(
      userId,
      automation.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await automationRepository.enable(data.id);

    await activityRepository.create({
      boardId: automation.boardId,
      userId,
      action: "automation.enabled",
      entityType: "automation",
      entityId: data.id,
      metadata: {},
    });

    return updated;
  },

  disable: async (userId: string, data: DisableAutomationInput) => {
    const automation = await automationRepository.findById(data.id);
    if (!automation) throw new Error("Automation not found");

    const hasPermission = await checkBoardPermission(
      userId,
      automation.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await automationRepository.disable(data.id);

    await activityRepository.create({
      boardId: automation.boardId,
      userId,
      action: "automation.disabled",
      entityType: "automation",
      entityId: data.id,
      metadata: {},
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteAutomationInput) => {
    const automation = await automationRepository.findById(data.id);
    if (!automation) throw new Error("Automation not found");

    const hasPermission = await checkBoardPermission(
      userId,
      automation.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    await automationRepository.delete(data.id);

    await activityRepository.create({
      boardId: automation.boardId,
      userId,
      action: "automation.deleted",
      entityType: "automation",
      entityId: data.id,
      metadata: { name: automation.name },
    });

    const board = await boardRepository.findById(automation.boardId);
    if (board) {
      await auditLogRepository.create({
        workspaceId: board.workspaceId,
        userId,
        action: "automation.deleted",
        entityType: "automation",
        entityId: data.id,
        metadata: { boardId: automation.boardId, name: automation.name },
      });
    }
  },
};
