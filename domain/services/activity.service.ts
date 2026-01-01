import { activityRepository } from "../repositories/activity.repository";
import { checkBoardPermission } from "@/lib/check-permissions";
import {
  LogBoardActionInput,
  LogCardActionInput,
  LogListActionInput,
  ReadActivityInput,
} from "../schemas/activity.schema";

export const activityService = {
  logBoard: async (userId: string, data: LogBoardActionInput) => {
    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const activity = await activityRepository.create({
      ...data,
      userId,
    });

    return activity;
  },

  logList: async (userId: string, data: LogListActionInput) => {
    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const activity = await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      metadata: data.metadata,
    });

    return activity;
  },

  logCard: async (userId: string, data: LogCardActionInput) => {
    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const activity = await activityRepository.create({
      boardId: data.boardId,
      cardId: data.cardId,
      userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      metadata: data.metadata,
    });

    return activity;
  },

  read: async (userId: string, data: ReadActivityInput) => {
    if (!data.boardId && !data.cardId) {
      throw new Error("Either boardId or cardId is required");
    }

    if (data.boardId) {
      const hasPermission = await checkBoardPermission(
        userId,
        data.boardId,
        "observer"
      );
      if (!hasPermission) throw new Error("Permission denied");
    }

    if (data.cardId) {
      const activities = await activityRepository.findByCardId(
        data.cardId,
        data.limit
      );
      return activities;
    }

    if (data.boardId) {
      const activities = await activityRepository.findByBoardId(
        data.boardId,
        data.limit
      );
      return activities;
    }

    return [];
  },
};
