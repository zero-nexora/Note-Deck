import { automationRepository } from "../repositories/automation.repository";
import { cardMemberRepository } from "../repositories/card-member.repository";
import { cardRepository } from "../repositories/card.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { CreateAutomationInput } from "../schemas/automation.schema";

export const automationService = {
  create: async (data: CreateAutomationInput) => {
    return await automationRepository.create(data);
  },

  execute: async (boardId: string, triggerType: string, eventData: any) => {
    const automations: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      actions: unknown;
      boardId: string;
      trigger: any;
      isActive: boolean;
    }[] = await automationRepository.findByBoardId(boardId);

    for (const automation of automations) {
      if (automation.trigger!.type === triggerType) {
        await executeAutomationActions(automation.actions as any[], eventData);
      }
    }
  },
};

const executeAutomationActions = async (actions: any[], eventData: any) => {
  for (const action of actions) {
    switch (action.type) {
      case "assign_member":
        if (eventData.card && action.userId) {
          await cardMemberRepository.add(eventData.cardId, action.userId);
        }
        break;

      case "send_notification":
        if (action.userId) {
          await notificationRepository.create({
            userId: action.userId,
            type: "assignment",
            title: action.title || "Automation Trigger",
            message: action.message || "An automation was triggered",
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
            action.position || 0
          );
        }
        break;

      default:
        break;
    }
  }
};
