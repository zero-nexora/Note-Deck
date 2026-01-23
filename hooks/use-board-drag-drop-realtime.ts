import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useList } from "./use-list";
import { useCard } from "./use-card";
import { useBroadcastEvent } from "@/lib/liveblocks";
import { useBoardRealtimePresence } from "./use-board-realtime-presence";
import { User } from "@/domain/types/user.type";

interface UseBoardDragDropRealtimeProps {
  board: BoardWithListLabelsAndMembers;
  realtimeUtils: ReturnType<typeof useBoardRealtimePresence>;
  user: User;
}

type DragType = "list" | "card" | null;

export function useBoardDragDropRealtime({
  board,
  realtimeUtils,
  user,
}: UseBoardDragDropRealtimeProps) {
  const { reorderLists } = useList();
  const { reorderCards, moveCard } = useCard();
  const broadcast = useBroadcastEvent();

  const [lists, setLists] = useState(board.lists);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeType, setActiveType] = useState<DragType>(null);
  const [originalSourceListId, setOriginalSourceListId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const updateLists = () => {
      setLists(board.lists);
    };
    board.lists && updateLists();
  }, [board.lists]);

  const activeCard = useMemo(() => {
    if (!activeId || activeType !== "card") return null;
    for (const list of lists) {
      const card = list.cards.find((c) => c.id === activeId);
      if (card) return card;
    }
    return null;
  }, [activeId, activeType, lists]);

  const activeList = useMemo(() => {
    if (!activeId || activeType !== "list") return null;
    return lists.find((list) => list.id === activeId) || null;
  }, [activeId, activeType, lists]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const type = active.data.current?.type as DragType;

      if (type === "card" && !realtimeUtils.canDragCard(active.id as string)) {
        return;
      }

      if (type === "list" && !realtimeUtils.canDragList(active.id as string)) {
        return;
      }

      setActiveId(active.id);
      setActiveType(type);

      if (type === "card") {
        const sourceList = board.lists.find((list) =>
          list.cards.some((c) => c.id === active.id),
        );
        setOriginalSourceListId(sourceList?.id ?? null);
        realtimeUtils.setDraggingCard(active.id as string);
      } else if (type === "list") {
        setOriginalSourceListId(null);
        realtimeUtils.setDraggingList(active.id as string);
      }
    },
    [board.lists, realtimeUtils],
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type as DragType;
    if (activeType !== "card") return;

    const overType = over.data.current?.type as DragType | undefined;
    if (overType !== "list" && overType !== "card") return;

    setLists((prevLists) => {
      let draggedCard = null;
      let sourceListId = "";
      let sourceCardIndex = -1;

      for (const list of prevLists) {
        const idx = list.cards.findIndex((c) => c.id === active.id);
        if (idx !== -1) {
          draggedCard = list.cards[idx];
          sourceListId = list.id;
          sourceCardIndex = idx;
          break;
        }
      }
      if (!draggedCard || !sourceListId) return prevLists;

      let destListId = "";
      let insertIndex = -1;

      if (overType === "list") {
        destListId = over.id as string;
        const destList = prevLists.find((l) => l.id === destListId);
        insertIndex = destList ? destList.cards.length : 0;
      } else {
        for (const list of prevLists) {
          const idx = list.cards.findIndex((c) => c.id === over.id);
          if (idx !== -1) {
            destListId = list.id;
            insertIndex = idx;
            break;
          }
        }
      }
      if (!destListId || insertIndex === -1) return prevLists;

      if (sourceListId === destListId && sourceCardIndex === insertIndex) {
        return prevLists;
      }

      const newLists = prevLists.map((list) => ({
        ...list,
        cards: [...list.cards],
      }));

      const sourceList = newLists.find((l) => l.id === sourceListId);
      const destList = newLists.find((l) => l.id === destListId);

      if (!sourceList || !destList) return prevLists;

      if (sourceListId === destListId) {
        sourceList.cards = arrayMove(
          sourceList.cards,
          sourceCardIndex,
          insertIndex,
        );
      } else {
        sourceList.cards.splice(sourceCardIndex, 1);
        destList.cards.splice(insertIndex, 0, draggedCard);
      }

      if (sourceListId === destListId) {
        sourceList.cards = sourceList.cards.map((card, idx) => ({
          ...card,
          position: idx + 1,
        }));
      } else {
        sourceList.cards = sourceList.cards.map((card, idx) => ({
          ...card,
          position: idx + 1,
        }));
        destList.cards = destList.cards.map((card, idx) => ({
          ...card,
          position: idx + 1,
        }));
      }

      return newLists;
    });
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setActiveType(null);

      const type = active.data.current?.type as DragType;

      if (type === "card") {
        realtimeUtils.setDraggingCard(null);
      } else if (type === "list") {
        realtimeUtils.setDraggingList(null);
      }

      if (!over) {
        setOriginalSourceListId(null);
        setLists(board.lists);
        return;
      }

      if (type === "list") {
        if (active.id === over.id) {
          setOriginalSourceListId(null);
          return;
        }

        const oldIndex = lists.findIndex((l) => l.id === active.id);
        const newIndex = lists.findIndex((l) => l.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newLists = arrayMove(lists, oldIndex, newIndex);
          const orders = newLists.map((list, idx) => ({
            id: list.id,
            position: idx + 1,
          }));

          setLists(
            newLists.map((list, idx) => ({
              ...list,
              position: idx + 1,
            })),
          );

          const result = await reorderLists({
            boardId: board.id,
            orders,
          });

          if (result) {
            broadcast({
              type: "LIST_REORDERED",
              userId: user.id,
              timestamp: Date.now(),
            });
          } else {
            setLists(board.lists);
          }
        }
        setOriginalSourceListId(null);
        return;
      }

      if (type !== "card" || !originalSourceListId) {
        setOriginalSourceListId(null);
        return;
      }

      let currentDestListId = "";

      for (const list of lists) {
        const cardIndex = list.cards.findIndex((c) => c.id === active.id);
        if (cardIndex !== -1) {
          currentDestListId = list.id;
          break;
        }
      }

      if (!currentDestListId) {
        setOriginalSourceListId(null);
        setLists(board.lists);
        return;
      }

      const isSameList = originalSourceListId === currentDestListId;

      try {
        if (isSameList) {
          const destList = lists.find((l) => l.id === currentDestListId);
          if (!destList) return;

          const orders = destList.cards.map((c) => ({
            id: c.id,
            position: c.position,
          }));

          const result = await reorderCards({
            listId: currentDestListId,
            orders,
          });

          if (result) {
            broadcast({
              type: "CARD_REORDERED",
              userId: user.id,
              timestamp: Date.now(),
            });
          } else {
            setLists(board.lists);
          }
        } else {
          const sourceList = lists.find((l) => l.id === originalSourceListId);
          const destList = lists.find((l) => l.id === currentDestListId);

          if (!sourceList || !destList) return;

          const sourceOrders = sourceList.cards.map((c) => ({
            id: c.id,
            position: c.position,
          }));

          const destinationOrders = destList.cards.map((c) => ({
            id: c.id,
            position: c.position,
          }));

          const result = await moveCard({
            id: active.id as string,
            sourceListId: originalSourceListId,
            destinationListId: currentDestListId,
            sourceOrders,
            destinationOrders,
          });

          if (result) {
            broadcast({
              type: "CARD_MOVED",
              userId: user.id,
              timestamp: Date.now(),
            });
          } else {
            setLists(board.lists);
          }
        }
      } catch (error) {
        console.error("Error updating position:", error);
        setLists(board.lists);
      }

      setOriginalSourceListId(null);
    },
    [
      board,
      lists,
      originalSourceListId,
      moveCard,
      reorderCards,
      reorderLists,
      realtimeUtils,
      broadcast,
      user.id,
    ],
  );

  return {
    lists,
    activeCard,
    activeList,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
