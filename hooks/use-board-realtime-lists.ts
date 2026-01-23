import { User } from "@/domain/types/user.type";
import { useCallback, useState } from "react";
import { useBroadcastEvent, useEventListener } from "@/lib/liveblocks";

type ListState = {
  id: string;
  boardId: string;
  name: string;
  position: number;
  isArchived: boolean;
  createdAt: any;
  updatedAt: any;
  cards: any;
};

type ListUpdate = {
  name?: string;
};

interface UseBoardRealtimeListsProps {
  user: User;
}

export const useBoardRealtimeLists = ({ user }: UseBoardRealtimeListsProps) => {
  const broadcast = useBroadcastEvent();
  const [listsUpdates, setListsUpdates] = useState<Map<string, ListUpdate>>(
    new Map(),
  );
  const [newLists, setNewLists] = useState<Map<string, ListState>>(new Map());
  const [deletedListIds, setDeletedListIds] = useState<Set<string>>(new Set());

  const broadcastListCreated = useCallback(
    (list: ListState) => {
      broadcast({
        type: "LIST_CREATED",
        list,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastListUpdated = useCallback(
    (listId: string, updates: ListUpdate) => {
      broadcast({
        type: "LIST_UPDATED",
        listId,
        updates,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastListDeleted = useCallback(
    (listId: string) => {
      broadcast({
        type: "LIST_DELETED",
        listId,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastListArchived = useCallback(
    (listId: string) => {
      broadcast({
        type: "LIST_ARCHIVED",
        listId,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastListRestored = useCallback(
    (listId: string) => {
      broadcast({
        type: "LIST_RESTORED",
        listId,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastListDuplicated = useCallback(
    (list: ListState) => {
      broadcast({
        type: "LIST_DUPLICATED",
        list,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  useEventListener(({ event }) => {
    if (event.userId === user.id) return;

    switch (event.type) {
      case "LIST_CREATED":
        setNewLists((prev) => {
          const newMap = new Map(prev);
          newMap.set(event.list.id, event.list || []);
          return newMap;
        });
        break;

      case "LIST_DUPLICATED":
        setNewLists((prev) => {
          const newMap = new Map(prev);
          newMap.set(event.list.id, event.list);
          return newMap;
        });
        break;

      case "LIST_UPDATED":
        setListsUpdates((prev) => {
          const newMap = new Map(prev);
          const existing = newMap.get(event.listId) || {};
          newMap.set(event.listId, { ...existing, ...event.updates });
          return newMap;
        });
        break;

      case "LIST_DELETED":
        setDeletedListIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(event.listId);
          return newSet;
        });
        setNewLists((prev) => {
          const newMap = new Map(prev);
          newMap.delete(event.listId);
          return newMap;
        });
        break;

      case "LIST_ARCHIVED":
        setDeletedListIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(event.listId);
          return newSet;
        });
        break;

      case "LIST_RESTORED":
        setDeletedListIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(event.listId);
          return newSet;
        });
        break;
    }
  });

  const getListValue = useCallback(
    (listId: string, field: keyof ListUpdate) => {
      return listsUpdates.get(listId)?.[field];
    },
    [listsUpdates],
  );

  const getNewLists = useCallback(() => {
    return Array.from(newLists.values());
  }, [newLists]);

  const isListDeleted = useCallback(
    (listId: string) => {
      return deletedListIds.has(listId);
    },
    [deletedListIds],
  );

  return {
    broadcastListCreated,
    broadcastListUpdated,
    broadcastListDeleted,
    broadcastListArchived,
    broadcastListRestored,
    broadcastListDuplicated,
    getListValue,
    getNewLists,
    isListDeleted,
  };
};
