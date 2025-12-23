import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import { boardRepository } from "../repositories/board.repository";
import { listRepository } from "../repositories/list.repository";
import { CreateCardInput, UpdateCardInput } from "../schemas/card.schema";
import { elasticsearchService } from "./elasticsearch.service";
import { checkBoardPermission } from "@/lib/permissions";

export const cardService = {
  create: async (userId: string, data: CreateCardInput) => {
    const board = await boardRepository.findById(data.boardId);
    if (!board) throw new Error("Board not found");

    const list = await listRepository.findById(data.listId);
    if (!list) throw new Error("List not found");

    if (list.boardId !== data.boardId) {
      throw new Error("List does not belong to board");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      data.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const card = await cardRepository.create({
      ...data,
      title: data.title.trim(),
      isArchived: false,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "card.created",
      entityType: "card",
      entityId: card.id,
      metadata: { title: card.title },
    });

    await elasticsearchService.indexCard(card.id);

    return card;
  },

  getById: async (userId: string, id: string) => {
    const card = await cardRepository.findById(id);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    return card;
  },

  update: async (userId: string, id: string, data: UpdateCardInput) => {
    const card = await cardRepository.findById(id);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const list = await listRepository.findById(data.listId);
    if (!list) throw new Error("List not found");

    if (list.boardId !== card.boardId) {
      throw new Error("Cannot move card to another board");
    }

    const updated = await cardRepository.update(id, data);

    await activityRepository.create({
      boardId: updated.boardId,
      cardId: updated.id,
      userId,
      action: "card.updated",
      entityType: "card",
      entityId: updated.id,
      metadata: data,
    });

    await elasticsearchService.indexCard(updated.id);

    return updated;
  },

  move: async (
    userId: string,
    cardId: string,
    sourceListId: string,
    destinationListId: string,
    position: number
  ) => {
    const card = await cardRepository.findById(cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (card.listId !== sourceListId) {
      throw new Error("Source list does not match card list");
    }

    const destinationList = await listRepository.findById(destinationListId);
    if (!destinationList) throw new Error("Destination list not found");

    if (destinationList.boardId !== card.boardId) {
      throw new Error("Cannot move card to another board");
    }

    const moved = await cardRepository.move(
      cardId,
      destinationListId,
      position
    );

    await activityRepository.create({
      boardId: moved.boardId,
      cardId: moved.id,
      userId,
      action: "card.moved",
      entityType: "card",
      entityId: moved.id,
      metadata: { sourceListId, destinationListId, position },
    });

    await elasticsearchService.indexCard(moved.id);

    return moved;
  },

  archive: async (userId: string, cardId: string) => {
    const card = await cardRepository.findById(cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const archived = await cardRepository.archive(cardId);

    await activityRepository.create({
      boardId: archived.boardId,
      cardId: archived.id,
      userId,
      action: "card.archived",
      entityType: "card",
      entityId: archived.id,
      metadata: {},
    });

    await elasticsearchService.indexCard(archived.id);

    return archived;
  },

  delete: async (userId: string, cardId: string) => {
    const card = await cardRepository.findById(cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    await cardRepository.delete(card.id);
  },
};
