import { canUser } from "@/lib/check-permissions";
import { activityRepository } from "../repositories/activity.repository";
import { boardRepository } from "../repositories/board.repository";
import {
  LogBoardActionInput,
  LogCardActionInput,
  LogListActionInput,
  ReadActivityInput,
} from "../schemas/activity.schema";
import { cardRepository } from "../repositories/card.repository";
import { DEFAULT_LIMIT_ACTIVITY, ROLE } from "@/lib/constants";

export const activityService = {
  logBoard: async (userId: string, data: LogBoardActionInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const trimmedAction = data.action.trim();
    if (!trimmedAction) {
      throw new Error("Action cannot be empty");
    }

    const trimmedEntityType = data.entityType.trim();
    if (!trimmedEntityType) {
      throw new Error("Entity type cannot be empty");
    }

    const trimmedEntityId = data.entityId.trim();
    if (!trimmedEntityId) {
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

    const trimmedAction = data.action.trim();
    if (!trimmedAction) {
      throw new Error("Action cannot be empty");
    }

    const trimmedEntityType = data.entityType.trim();
    if (!trimmedEntityType) {
      throw new Error("Entity type cannot be empty");
    }

    const trimmedEntityId = data.entityId.trim();
    if (!trimmedEntityId) {
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

    const trimmedCardId = data.cardId.trim();
    if (!trimmedCardId) {
      throw new Error("Card ID cannot be empty");
    }

    const trimmedAction = data.action.trim();
    if (!trimmedAction) {
      throw new Error("Action cannot be empty");
    }

    const trimmedEntityType = data.entityType.trim();
    if (!trimmedEntityType) {
      throw new Error("Entity type cannot be empty");
    }

    const trimmedEntityId = data.entityId.trim();
    if (!trimmedEntityId) {
      throw new Error("Entity ID cannot be empty");
    }

    const card = await cardRepository.findByIdWithBoard(data.cardId);
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

    if (data.cardId) {
      const card = await cardRepository.findByIdWithBoard(data.cardId);
      if (!card) throw new Error("Card not found");

      const allowed = await canUser(userId, {
        workspaceId: card.board.workspaceId,
        boardId: card.boardId,
        boardRole: ROLE.OBSERVER,
      });
      if (!allowed) throw new Error("Permission denied");

      return activityRepository.findByCardId(
        data.cardId,
        data.limit || DEFAULT_LIMIT_ACTIVITY
      );
    }

    const board = await boardRepository.findById(data.boardId!);
    if (!board) throw new Error("Board not found");

    const allowed = await canUser(userId, {
      workspaceId: board.workspaceId,
      workspaceRole: ROLE.OBSERVER,
    });
    if (!allowed) throw new Error("Permission denied");

    return activityRepository.findByBoardId(
      data.boardId!,
      data.limit || DEFAULT_LIMIT_ACTIVITY
    );
  },
};
