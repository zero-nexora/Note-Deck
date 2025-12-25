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
import { BoardOverlay } from "./board-overlay";
import { LiveCursors } from "./live-cursors";
import { LiveDragOverlay } from "./live-drap-overlay";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { BoardHeader } from "./board-header";

interface BoardContentProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardContent = ({ board }: BoardContentProps) => {
  const { startDragging, updateDragging, stopDragging } = useBoardRealtime();

  const {
    activeId,
    activeType,
    overId,
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

  const activeCard =
    activeType === "card"
      ? board.lists.flatMap((l) => l.cards).find((c) => c.id === activeId) ??
        null
      : null;

  const activeList =
    activeType === "list"
      ? board.lists.find((l) => l.id === activeId) ?? null
      : null;

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <BoardHeader />
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
          <LiveDragOverlay board={board} />

          <BoardLists board={board} activeId={activeId} overId={overId} />

          <BoardOverlay activeCard={activeCard} activeList={activeList} />
        </div>
      </DndContext>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
