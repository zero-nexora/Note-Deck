"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { useCallback, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CardItem } from "./card-item";
import { BoardListColumn } from "./board-list-column";
import { CreateList } from "./create-list";

interface BoardContentProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardContent = ({ board }: BoardContentProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"card" | "list" | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const { startDragging, updateDragging, stopDragging } = useBoardRealtime();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const resetDragState = () => {
    setActiveId(null);
    setActiveType(null);
    dragStartPosRef.current = null;
  };

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

      dragStartPosRef.current = offset;

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    stopDragging();

    if (!over) {
      resetDragState();
      return;
    }

    resetDragState();
  };

  const activeCard =
    activeType === "card"
      ? board.lists.flatMap((l) => l.cards).find((c) => c.id === activeId) ??
        null
      : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div className="relative h-full">
        <div className="flex gap-4 p-4 overflow-x-auto h-full">
          <SortableContext
            items={board.lists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists.map((list) => (
              <BoardListColumn key={list.id} list={list} />
            ))}
          </SortableContext>

          <CreateList board={board} />
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 opacity-90">
              <CardItem card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
