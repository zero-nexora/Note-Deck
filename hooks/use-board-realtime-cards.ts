import { User } from "@/domain/types/user.type";
import { useCallback, useState } from "react";
import {
  useBroadcastEvent,
  useEventListener,
} from "@/lib/liveblocks";

type CardState = {
  id: string;
  listId: string;
  boardId: string;
  title: string;
  description: string | null;
  position: number;
  dueDate: any;
  coverImage: string | null;
  isArchived: boolean;
  createdAt: any;
  updatedAt: any;
  attachmentsCount: number;
  commentsCount: number;
  checklistsCount: number;
  cardLabels: {
    id: string;
    cardId: string;
    labelId: string;
    label: {
      id: string;
      boardId: string;
      name: string;
      color: string;
      createdAt: any;
    };
  }[];
  members: {
    id: string;
    cardId: string;
    userId: string;
    createdAt: any;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }[];
};

type CardUpdate = {
  title?: string;
  description?: string | null;
  dueDate?: any;
  coverImage?: string | null;
};

interface UseBoardRealtimeCardsProps {
  user: User;
}

export const useBoardRealtimeCards = ({ user }: UseBoardRealtimeCardsProps) => {
  const broadcast = useBroadcastEvent();
  const [cardsUpdates, setCardsUpdates] = useState<Map<string, CardUpdate>>(
    new Map(),
  );
  const [newCards, setNewCards] = useState<Map<string, CardState>>(new Map());
  const [deletedCardIds, setDeletedCardIds] = useState<Set<string>>(new Set());

  const broadcastCardCreated = useCallback(
    (card: CardState) => {
      broadcast({
        type: "CARD_CREATED",
        card,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardUpdated = useCallback(
    (cardId: string, listId: string, updates: CardUpdate) => {
      broadcast({
        type: "CARD_UPDATED",
        cardId,
        listId,
        updates,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardDeleted = useCallback(
    (cardId: string, listId: string) => {
      broadcast({
        type: "CARD_DELETED",
        cardId,
        listId,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardArchived = useCallback(
    (cardId: string, listId: string) => {
      broadcast({
        type: "CARD_ARCHIVED",
        cardId,
        listId,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardRestored = useCallback(
    (cardId: string, listId: string) => {
      broadcast({
        type: "CARD_RESTORED",
        cardId,
        listId,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardDuplicated = useCallback(
    (card: CardState) => {
      broadcast({
        type: "CARD_DUPLICATED",
        card,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  useEventListener(({ event }) => {
    if (event.userId === user.id) return;

    switch (event.type) {
      case "CARD_CREATED":
        setNewCards((prev) => {
          const newMap = new Map(prev);
          newMap.set(event.card.id, event.card);
          return newMap;
        });
        break;

      case "CARD_DUPLICATED":
        setNewCards((prev) => {
          const newMap = new Map(prev);
          newMap.set(event.card.id, event.card);
          return newMap;
        });
        break;

      case "CARD_UPDATED":
        setCardsUpdates((prev) => {
          const newMap = new Map(prev);
          const existing = newMap.get(event.cardId) || {};
          newMap.set(event.cardId, { ...existing, ...event.updates });
          return newMap;
        });
        break;

      case "CARD_DELETED":
        setDeletedCardIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(event.cardId);
          return newSet;
        });
        setNewCards((prev) => {
          const newMap = new Map(prev);
          newMap.delete(event.cardId);
          return newMap;
        });
        break;

      case "CARD_ARCHIVED":
        setDeletedCardIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(event.cardId);
          return newSet;
        });
        break;

      case "CARD_RESTORED":
        setDeletedCardIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(event.cardId);
          return newSet;
        });
        break;
    }
  });

  const getCardValue = useCallback(
    (cardId: string, field: keyof CardUpdate) => {
      return cardsUpdates.get(cardId)?.[field];
    },
    [cardsUpdates],
  );

  const getNewCards = useCallback(() => {
    return Array.from(newCards.values());
  }, [newCards]);

  const isCardDeleted = useCallback(
    (cardId: string) => {
      return deletedCardIds.has(cardId);
    },
    [deletedCardIds],
  );

  return {
    broadcastCardCreated,
    broadcastCardUpdated,
    broadcastCardDeleted,
    broadcastCardArchived,
    broadcastCardRestored,
    broadcastCardDuplicated,
    getCardValue,
    getNewCards,
    isCardDeleted,
  };
};
