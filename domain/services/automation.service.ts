import { automationRepository } from "../repositories/automation.repository";
import { boardRepository } from "../repositories/board.repository";
import { activityRepository } from "../repositories/activity.repository";
import { checkBoardPermission } from "@/lib/check-permissions";
import {
  CreateAutomationInput,
  DeleteAutomationInput,
  DisableAutomationInput,
  EnableAutomationInput,
  UpdateAutomationInput,
} from "../schemas/automation.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { Action, AutomationEvent, Trigger } from "../types/automation.type";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import {
  cardLabels,
  cardMembers,
  cards,
  comments,
  lists,
  notifications,
} from "@/db/schema";

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

  findByBoardId: async (userId: string, boardId: string) => {
    const hasPermission = await checkBoardPermission(
      userId,
      boardId,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const automations = await automationRepository.findByBoardId(boardId);
    return automations;
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

const SYSTEM_USER_ID = "system";

export async function executeAutomations(event: AutomationEvent) {
  const rules = await automationRepository.findByBoardId(event.boardId);

  for (const rule of rules) {
    if (!matchTrigger(rule.trigger as Trigger, event)) continue;

    for (const action of rule.actions as Action[]) {
      try {
        await executeAction(action, event);
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
  }
}

function matchTrigger(trigger: Trigger, event: AutomationEvent): boolean {
  if (trigger.type !== event.type) return false;

  switch (trigger.type) {
    case "CARD_MOVED":
      if (trigger.fromListId && trigger.fromListId !== event.fromListId)
        return false;
      if (trigger.toListId && trigger.toListId !== event.toListId) return false;
      break;

    case "CARD_CREATED":
      if (trigger.listId && trigger.listId !== event.listId) return false;
      break;

    case "LABEL_ADDED_TO_CARD":
    case "LABEL_REMOVED_FROM_CARD":
      if (trigger.labelId && trigger.labelId !== event.labelId) return false;
      break;

    case "CARD_ASSIGNED":
    case "CARD_UNASSIGNED":
    case "USER_MENTIONED":
      if (trigger.userId && trigger.userId !== event.userId) return false;
      break;

    case "LIST_ARCHIVED":
      if (trigger.listId && trigger.listId !== event.listId) return false;
      break;

    case "CARD_UPDATED":
      if (trigger.field && trigger.field !== event.field) return false;
      break;
  }

  return true;
}

async function executeAction(action: Action, event: AutomationEvent) {
  if (!event.cardId && needsCardId(action.type)) {
    console.error(`Action ${action.type} requires cardId`);
    return;
  }

  switch (action.type) {
    case "ASSIGN_MEMBER":
      await assignMember(event.cardId!, action.userId);
      break;

    case "ADD_LABEL":
      await addLabel(event.cardId!, action.labelId);
      break;

    case "ADD_COMMENT":
      await addComment(event.cardId!, action.content, event.userId);
      break;

    case "SEND_NOTIFICATION":
      await sendNotification(
        action.userId || event.userId!,
        action.title,
        action.message,
        action.notificationType,
        event.cardId
      );
      break;

    case "LOG_ACTIVITY":
      await logActivity(
        event.boardId,
        event.cardId,
        event.userId || SYSTEM_USER_ID,
        action.action,
        action.entityType,
        event.cardId || event.listId || event.boardId,
        event.metadata
      );
      break;

    case "MOVE_CARD":
      await moveCard(event.cardId!, action.toListId);
      break;

    case "ARCHIVE_CARD":
      await archiveCard(event.cardId!);
      break;

    case "ADD_LIST":
      await addList(event.boardId, action.name);
      break;

    default:
      console.warn(`Unknown action type: ${(action as any).type}`);
  }
}

async function assignMember(cardId: string, userId: string) {
  const exists = await db.query.cardMembers.findFirst({
    where: and(eq(cardMembers.cardId, cardId), eq(cardMembers.userId, userId)),
  });

  if (!exists) {
    await db.insert(cardMembers).values({ cardId, userId });
  }
}

async function addLabel(cardId: string, labelId: string) {
  const exists = await db.query.cardLabels.findFirst({
    where: and(eq(cardLabels.cardId, cardId), eq(cardLabels.labelId, labelId)),
  });

  if (!exists) {
    await db.insert(cardLabels).values({ cardId, labelId });
  }
}

async function addComment(cardId: string, content: string, userId?: string) {
  await db.insert(comments).values({
    cardId,
    userId: userId || SYSTEM_USER_ID,
    content,
    mentions: [],
  });
}

async function sendNotification(
  userId: string,
  title: string,
  message: string,
  notificationType: string,
  entityId?: string
) {
  await db.insert(notifications).values({
    userId,
    type: notificationType as any,
    title,
    message,
    entityType: "card",
    entityId,
  });
}

async function logActivity(
  boardId: string,
  cardId: string | undefined,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: any
) {
  const { activities } = await import("@/db/schema");
  await db.insert(activities).values({
    boardId,
    cardId,
    userId,
    action,
    entityType,
    entityId,
    metadata: metadata || {},
  });
}

async function moveCard(cardId: string, toListId: string) {
  const card = await db.query.cards.findFirst({
    where: eq(cards.id, cardId),
  });

  if (!card) return;

  const maxPosition = await getMaxCardPosition(toListId);

  await db
    .update(cards)
    .set({
      listId: toListId,
      position: maxPosition + 1,
      updatedAt: new Date(),
    })
    .where(eq(cards.id, cardId));
}

async function archiveCard(cardId: string) {
  await db
    .update(cards)
    .set({ isArchived: true, updatedAt: new Date() })
    .where(eq(cards.id, cardId));
}

async function addList(boardId: string, name: string) {
  const maxPosition = await getMaxListPosition(boardId);

  await db.insert(lists).values({
    boardId,
    name,
    position: maxPosition + 1,
  });
}

function needsCardId(actionType: string): boolean {
  return [
    "ASSIGN_MEMBER",
    "ADD_LABEL",
    "ADD_COMMENT",
    "MOVE_CARD",
    "ARCHIVE_CARD",
  ].includes(actionType);
}

async function getMaxCardPosition(listId: string): Promise<number> {
  const result = await db.query.cards.findMany({
    where: eq(cards.listId, listId),
    orderBy: (cards, { desc }) => [desc(cards.position)],
    limit: 1,
  });
  return result[0]?.position ?? -1;
}

async function getMaxListPosition(boardId: string): Promise<number> {
  const result = await db.query.lists.findMany({
    where: eq(lists.boardId, boardId),
    orderBy: (lists, { desc }) => [desc(lists.position)],
    limit: 1,
  });
  return result[0]?.position ?? -1;
}
