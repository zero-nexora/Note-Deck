import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
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

interface UseBoardDragDropProps {
  board: BoardWithListColumnLabelAndMember;
}

type DragType = "list" | "card" | null;

export function useBoardDragDrop({ board }: UseBoardDragDropProps) {
  const { reorderLists } = useList();
  const { reorderCards, moveCard } = useCard();

  const [lists, setLists] = useState(board.lists);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeType, setActiveType] = useState<DragType>(null);
  const [originalSourceListId, setOriginalSourceListId] = useState<string | null>(null);

  useEffect(() => {
    const handleSetBoardLists = () => setLists(board.lists);
    handleSetBoardLists();
  }, [board.lists])

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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
    const type = active.data.current?.type as DragType;
    setActiveType(type);

    if (type === "card") {
      const sourceList = board.lists.find((list) =>
        list.cards.some((c) => c.id === active.id)
      );
      setOriginalSourceListId(sourceList?.id ?? null);
    } else {
      setOriginalSourceListId(null);
    }
  }, [board.lists]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type as DragType;
    if (activeType !== "card") return;

    const overType = over.data.current?.type as DragType | undefined;
    if (overType !== "list" && overType !== "card") return;

    setLists((prevLists) => {
      // Find card và source list
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

      // Find destination list và insert position
      let destListId = "";
      let insertIndex = -1;

      if (overType === "list") {
        // Drop vào empty list hoặc cuối list
        destListId = over.id as string;
        const destList = prevLists.find((l) => l.id === destListId);
        insertIndex = destList ? destList.cards.length : 0;
      } else {
        // Drop vào card cụ thể
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

      // Nếu cùng list và cùng vị trí thì không làm gì
      if (sourceListId === destListId && sourceCardIndex === insertIndex) {
        return prevLists;
      }

      // Clone lists để update
      const newLists = prevLists.map((list) => ({
        ...list,
        cards: [...list.cards],
      }));

      const sourceList = newLists.find((l) => l.id === sourceListId);
      const destList = newLists.find((l) => l.id === destListId);

      if (!sourceList || !destList) return prevLists;

      if (sourceListId === destListId) {
        // Cùng list: reorder trong list
        sourceList.cards = arrayMove(sourceList.cards, sourceCardIndex, insertIndex);
      } else {
        // Khác list: remove từ source và add vào dest
        sourceList.cards.splice(sourceCardIndex, 1);
        destList.cards.splice(insertIndex, 0, draggedCard);
      }

      // Update position cho tất cả cards trong lists bị ảnh hưởng
      if (sourceListId === destListId) {
        sourceList.cards = sourceList.cards.map((card, idx) => ({
          ...card,
          position: (idx + 1) * 1024,
        }));
      } else {
        sourceList.cards = sourceList.cards.map((card, idx) => ({
          ...card,
          position: (idx + 1) * 1024,
        }));
        destList.cards = destList.cards.map((card, idx) => ({
          ...card,
          position: (idx + 1) * 1024,
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

      if (!over) {
        setOriginalSourceListId(null);
        setLists(board.lists); // Reset về state ban đầu nếu drop không hợp lệ
        return;
      }

      const type = active.data.current?.type as DragType;

      // Xử lý drag list
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
            position: (idx + 1) * 1024,
          }));

          setLists(
            newLists.map((list, idx) => ({
              ...list,
              position: (idx + 1) * 1024,
            }))
          );

          await reorderLists({
            boardId: board.id,
            orders,
          });
        }
        setOriginalSourceListId(null);
        return;
      }

      // Xử lý drag card
      if (type !== "card" || !originalSourceListId) {
        setOriginalSourceListId(null);
        return;
      }

      // Find current destination list của card
      let currentDestListId = "";
      for (const list of lists) {
        if (list.cards.some((c) => c.id === active.id)) {
          currentDestListId = list.id;
          break;
        }
      }

      if (!currentDestListId) {
        setOriginalSourceListId(null);
        setLists(board.lists); // Reset nếu không tìm thấy
        return;
      }

      const isSameList = originalSourceListId === currentDestListId;

      try {
        if (isSameList) {
          // Cùng list: gọi reorderCards
          const destList = lists.find((l) => l.id === currentDestListId);
          if (!destList) return;

          const orders = destList.cards.map((c) => ({
            id: c.id,
            position: c.position,
          }));

          await reorderCards({
            listId: currentDestListId,
            orders,
          });
        } else {
          // Khác list: gọi moveCard
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

          await moveCard({
            id: active.id as string,
            sourceListId: originalSourceListId,
            destinationListId: currentDestListId,
            sourceOrders,
            destinationOrders,
          });
        }
      } catch (error) {
        console.error("Error updating card position:", error);
        // Reset về state ban đầu nếu có lỗi
        setLists(board.lists);
      }

      setOriginalSourceListId(null);
    },
    [board, lists, originalSourceListId, moveCard, reorderCards, reorderLists]
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