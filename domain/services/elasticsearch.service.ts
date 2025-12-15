import {
  BOARD_INDEX,
  CARD_INDEX,
  elasticsearchClient,
} from "@/lib/elasticsearch";
import { cardRepository } from "../repositories/card.repository";
import { boardRepository } from "../repositories/board.repository";

export const elasticsearchService = {
  indexCard: async (cardId: string) => {
    const card = await cardRepository.findById(cardId);

    if (!card) return;

    await elasticsearchClient.index({
      index: CARD_INDEX,
      id: card.id,
      document: {
        id: card.id,
        title: card.title,
        description: card.description,
        boardId: card.boardId,
        listId: card.listId,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      },
    });
  },

  indexBoard: async (boardId: string) => {
    const board = await boardRepository.findById(boardId);

    if (!board) return;

    await elasticsearchClient.index({
      index: BOARD_INDEX,
      id: board.id,
      document: {
        id: board.id,
        name: board.name,
        description: board.description,
        workspaceId: board.workspaceId,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      },
    });
  },

  deleteCardFromIndex: async (cardId: string) => {
    try {
      await elasticsearchClient.delete({
        index: CARD_INDEX,
        id: cardId,
      });
    } catch (error) {
      console.error("Failed to delete card from index:", error);
    }
  },

  searchCards: async (query: string, workspaceId?: string) => {
    const searchQuery: any = {
      bool: {
        should: [
          { match: { title: { query, boost: 2 } } },
          { match: { description: query } },
        ],
        minimum_should_match: 1,
      },
    };

    if (workspaceId) {
      searchQuery.bool.filter = [{ term: { workspaceId } }];
    }

    const result = await elasticsearchClient.search({
      index: CARD_INDEX,
      query: searchQuery,
    });

    return result.hits.hits.map((hit: any) => hit._source);
  },

  searchBoards: async (query: string, workspaceId?: string) => {
    const searchQuery: any = {
      bool: {
        should: [
          { match: { name: { query, boost: 2 } } },
          { match: { description: query } },
        ],
        minimum_should_match: 1,
      },
    };

    if (workspaceId) {
      searchQuery.bool.filter = [{ term: { workspaceId } }];
    }

    const result = await elasticsearchClient.search({
      index: BOARD_INDEX,
      query: searchQuery,
    });

    return result.hits.hits.map((hit: any) => hit._source);
  },
};
