import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import { CreateCardInput, UpdateCardInput } from "../schemas/card.schema";
import { elasticsearchService } from "./elasticsearch.service";

export const cardService = {
  create: async (userId: string, data: CreateCardInput) => {
    const card = await cardRepository.create(data);

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

  getById: async (cardId: string) => {
    return await cardRepository.findById(cardId);
  },

  update: async (userId: string, data: UpdateCardInput) => {
    const updated = await cardRepository.update(data);

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
};
