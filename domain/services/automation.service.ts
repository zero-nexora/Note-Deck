import { automationRepository } from "../repositories/automation.repository";
import { cardMemberRepository } from "../repositories/card-member.repository";
import { cardRepository } from "../repositories/card.repository";
import { notificationRepository } from "../repositories/notification.repository";
import {
  CreateAutomationInput,
  UpdateAutomationInput,
} from "../schemas/automation.schema";
import { checkBoardPermission } from "@/lib/permissions";

export const automationService = {
  create: async (userId: string, data: CreateAutomationInput) => {
    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    return await automationRepository.create(data);
  },

  update: async (
    userId: string,
    automationId: string,
    data: UpdateAutomationInput
  ) => {
    const automation = await automationRepository.findById(automationId);
    if (!automation) throw new Error("Automation not found");

    const hasPermission = await checkBoardPermission(
      userId,
      automation.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    return await automationRepository.update(automationId, data);
  },

  delete: async (userId: string, automationId: string) => {
    const automation = await automationRepository.findById(automationId);
    if (!automation) throw new Error("Automation not found");

    const hasPermission = await checkBoardPermission(
      userId,
      automation.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    await automationRepository.delete(automationId);
  },

  execute: async (boardId: string, triggerType: string, eventData: any) => {
    const automations = await automationRepository.findByBoardId(boardId);

    for (const automation of automations) {
      if (!automation.isActive) continue;

      if ((automation.trigger as any)?.type === triggerType) {
        await executeAutomationActions(automation.actions as any[], eventData);
      }
    }
  },
};

const executeAutomationActions = async (actions: any[], eventData: any) => {
  for (const action of actions) {
    switch (action.type) {
      case "assign_member":
        if (eventData.cardId && action.userId) {
          await cardMemberRepository.add({
            cardId: eventData.cardId,
            userId: action.userId,
          });
        }
        break;

      case "send_notification":
        if (action.userId) {
          await notificationRepository.create({
            userId: action.userId,
            type: "comment",
            title: action.title ?? "Automation Triggered",
            message: action.message ?? "An automation was triggered",
            entityType: eventData.entityType,
            entityId: eventData.entityId,
          });
        }
        break;

      case "move_card":
        if (eventData.cardId && action.listId) {
          await cardRepository.move(
            eventData.cardId,
            action.listId,
            action.position ?? 0
          );
        }
        break;

      default:
        break;
    }
  }
};
