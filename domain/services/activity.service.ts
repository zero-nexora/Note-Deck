import { checkBoardPermission } from "@/lib/check-permissions";
import { activityRepository } from "../repositories/activity.repository";
import { boardRepository } from "../repositories/board.repository";
import {
  LogBoardActionInput,
  LogCardActionInput,
  LogListActionInput,
  ReadActivityInput,
} from "../schemas/activity.schema";
import { cardRepository } from "../repositories/card.repository";

export const activityService = {
  logBoard: async (userId: string, data: LogBoardActionInput) => {
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

    if (!data.action || data.action.trim() === "") {
      throw new Error("Action cannot be empty");
    }

    if (!data.entityType || data.entityType.trim() === "") {
      throw new Error("Entity type cannot be empty");
    }

    if (!data.entityId || data.entityId.trim() === "") {
      throw new Error("Entity ID cannot be empty");
    }

    const activity = await activityRepository.create({
      ...data,
      userId,
    });

    return activity;
  },

  logList: async (userId: string, data: LogListActionInput) => {
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

    if (!data.action || data.action.trim() === "") {
      throw new Error("Action cannot be empty");
    }

    if (!data.entityType || data.entityType.trim() === "") {
      throw new Error("Entity type cannot be empty");
    }

    if (!data.entityId || data.entityId.trim() === "") {
      throw new Error("Entity ID cannot be empty");
    }

    const activity = await activityRepository.create({
      boardId: data.boardId,
      userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      metadata: data.metadata || {},
    });

    return activity;
  },

  logCard: async (userId: string, data: LogCardActionInput) => {
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

    if (!data.cardId || data.cardId.trim() === "") {
      throw new Error("Card ID cannot be empty");
    }

    if (!data.action || data.action.trim() === "") {
      throw new Error("Action cannot be empty");
    }

    if (!data.entityType || data.entityType.trim() === "") {
      throw new Error("Entity type cannot be empty");
    }

    if (!data.entityId || data.entityId.trim() === "") {
      throw new Error("Entity ID cannot be empty");
    }

    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    if (card.boardId !== data.boardId) {
      throw new Error("Card does not belong to this board");
    }

    const activity = await activityRepository.create({
      boardId: data.boardId,
      cardId: data.cardId,
      userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      metadata: data.metadata || {},
    });

    return activity;
  },

  read: async (userId: string, data: ReadActivityInput) => {
    if (!data.boardId && !data.cardId) {
      throw new Error("Either boardId or cardId is required");
    }

    if (data.boardId) {
      const board = await boardRepository.findById(data.boardId);
      if (!board) {
        throw new Error("Board not found");
      }

      const hasPermission = await checkBoardPermission(
        userId,
        data.boardId,
        "observer"
      );
      if (!hasPermission) {
        throw new Error("Permission denied");
      }
    }

    if (data.cardId) {
      const card = await cardRepository.findById(data.cardId);
      if (!card) {
        throw new Error("Card not found");
      }

      const hasPermission = await checkBoardPermission(
        userId,
        card.boardId,
        "observer"
      );
      if (!hasPermission) {
        throw new Error("Permission denied");
      }

      const activities = await activityRepository.findByCardId(
        data.cardId,
        data.limit || 50
      );
      return activities;
    }

    if (data.boardId) {
      const activities = await activityRepository.findByBoardId(
        data.boardId,
        data.limit || 50
      );
      return activities;
    }

    return [];
  },
};
