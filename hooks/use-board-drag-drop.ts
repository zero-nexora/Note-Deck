"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import {
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";

interface UseBoardDragDropProps {
  board: BoardWithListColumnLabelAndMember;
  startDragging: (
    type: "card" | "list",
    draggingId: string,
    dragOffset: { x: number; y: number },
    pointer: { x: number; y: number },
    sourceListId?: string | null,
    sourcePosition?: number | null
  ) => void;
  updateDragging: (pointer: { x: number; y: number }) => void;
  stopDragging: () => void;
}

export function useBoardDragDrop({
  board,
  startDragging,
  updateDragging,
  stopDragging,
}: UseBoardDragDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"card" | "list" | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const resetDragState = useCallback(() => {
    setActiveId(null);
    setActiveType(null);
    setOverId(null);
  }, []);

  const findList = useCallback(
    (listId: string) => board.lists.find((l) => l.id === listId),
    [board.lists]
  );

  const findListIndex = useCallback(
    (listId: string) => board.lists.findIndex((l) => l.id === listId),
    [board.lists]
  );

  const updatePositions = <T extends { position: number }>(items: T[]) => {
    items.forEach((item, index) => {
      item.position = index;
    });
  };

  const reorderItems = <T extends { position: number }>(
    items: T[],
    oldIndex: number,
    newIndex: number
  ) => {
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    updatePositions(reordered);
    items.splice(0, items.length, ...reordered);
  };

  const moveCardBetweenLists = useCallback(
    (
      sourceListId: string,
      destinationListId: string,
      cardId: string,
      destinationIndex?: number
    ) => {
      const sourceList = findList(sourceListId);
      const destinationList = findList(destinationListId);

      if (!sourceList || !destinationList) return false;

      const sourceCardIndex = sourceList.cards.findIndex(
        (c) => c.id === cardId
      );
      if (sourceCardIndex === -1) return false;

      const cardAlreadyInDestination = destinationList.cards.some(
        (c) => c.id === cardId
      );

      if (cardAlreadyInDestination) {
        const oldIndex = destinationList.cards.findIndex(
          (c) => c.id === cardId
        );
        const newIndex = destinationIndex ?? destinationList.cards.length - 1;
        reorderItems(destinationList.cards, oldIndex, newIndex);
        return true;
      }

      const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);
      movedCard.listId = destinationListId;

      const insertIndex = destinationIndex ?? destinationList.cards.length;
      destinationList.cards.splice(insertIndex, 0, movedCard);

      updatePositions(sourceList.cards);
      updatePositions(destinationList.cards);

      return true;
    },
    [findList]
  );

  const handleCardDrag = useCallback(
    (activeCard: any, overData: any, overId: UniqueIdentifier) => {
      const sourceListId = activeCard.listId;

      if (overData?.type === "card") {
        const overCard = overData.card;
        const destinationListId = overCard.listId;

        if (sourceListId === destinationListId) {
          const list = findList(sourceListId);
          if (!list) return;

          const oldIndex = list.cards.findIndex((c) => c.id === activeCard.id);
          const newIndex = list.cards.findIndex((c) => c.id === overCard.id);
          reorderItems(list.cards, oldIndex, newIndex);
        } else {
          const destinationList = findList(destinationListId);
          if (!destinationList) return;

          const destinationIndex = destinationList.cards.findIndex(
            (c) => c.id === overCard.id
          );
          moveCardBetweenLists(
            sourceListId,
            destinationListId,
            activeCard.id,
            destinationIndex
          );
        }
      }

      if (overData?.type === "list" && sourceListId !== overId) {
        moveCardBetweenLists(sourceListId, overId as string, activeCard.id);
      }
    },
    [findList, moveCardBetweenLists]
  );

  const handleListDrag = useCallback(
    (activeId: UniqueIdentifier, overId: UniqueIdentifier) => {
      const oldIndex = findListIndex(activeId as string);
      const newIndex = findListIndex(overId as string);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderItems(board.lists, oldIndex, newIndex);
      }
    },
    [board.lists, findListIndex]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const data = active.data.current;

      setActiveId(active.id as string);
      setActiveType(data?.type);

      const rect = (
        event.activatorEvent.target as HTMLElement
      ).getBoundingClientRect();
      const pointerX = (event.activatorEvent as PointerEvent).clientX;
      const pointerY = (event.activatorEvent as PointerEvent).clientY;

      if (!rect) return;

      const offset = {
        x: pointerX - rect.left,
        y: pointerY - rect.top,
      };

      if (data?.type === "card") {
        startDragging(
          "card",
          active.id as string,
          offset,
          { x: pointerX, y: pointerY },
          data.card.listId,
          data.card.position
        );
      }

      if (data?.type === "list") {
        startDragging(
          "list",
          active.id as string,
          offset,
          { x: pointerX, y: pointerY },
          undefined,
          data.list.position
        );
      }
    },
    [startDragging]
  );

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const pointerX =
        (event.activatorEvent as PointerEvent).clientX + event.delta.x;
      const pointerY =
        (event.activatorEvent as PointerEvent).clientY + event.delta.y;

      updateDragging({ x: pointerX, y: pointerY });
    },
    [updateDragging]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        setOverId(null);
        return;
      }

      setOverId(over.id);

      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData?.type === "list" && overData?.type === "card") return;

      if (activeData?.type === "card") {
        handleCardDrag(activeData.card, overData, over.id);
      }

      if (activeData?.type === "list" && overData?.type === "list") {
        handleListDrag(active.id, over.id);
      }
    },
    [handleCardDrag, handleListDrag]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      stopDragging();
      resetDragState();
    },
    [stopDragging, resetDragState]
  );

  return {
    activeId,
    activeType,
    overId,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
  };
}
