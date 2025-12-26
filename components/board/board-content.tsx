"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { useBoardDragDrop } from "@/hooks/use-board-drag-drop";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { BoardLists } from "./board-lists";
import { LiveCursors } from "./live-cursors";
import { LiveDragOverlay } from "./live-drap-overlay";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { BoardOverlay } from "./board-overlay";

interface BoardContentProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardContent = ({ board }: BoardContentProps) => {
  const { startDragging, updateDragging, stopDragging } = useBoardRealtime();

  const {
    activeId,
    localBoard,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragDrop({
    board,
    startDragging,
    updateDragging,
    stopDragging,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeCard = activeId
    ? board.lists
        .flatMap((list) => list.cards)
        .find((card) => card.id === activeId)
    : null;

  const activeList = activeId
    ? board.lists.find((list) => list.id === activeId)
    : null;

  return (
    <ScrollArea className="h-[calc(100vh-210px)]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="relative h-full">
          <LiveCursors />
          <LiveDragOverlay board={localBoard} />

          <BoardLists board={localBoard} />

          <BoardOverlay activeCard={activeCard} activeList={activeList} />
        </div>
      </DndContext>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
