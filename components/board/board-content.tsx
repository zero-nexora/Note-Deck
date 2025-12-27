"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
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
  const {
    lists,
    activeCard,
    activeList,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragDrop({ board });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updatedBoard = {
    ...board,
    lists,
  };

  return (
    <ScrollArea className="h-[calc(100vh-210px)]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="relative h-full">
          {/* <LiveCursors /> */}
          {/* <LiveDragOverlay board={updatedBoard} /> */}
          <BoardLists board={updatedBoard} />
          <BoardOverlay activeCard={activeCard} activeList={activeList} />
        </div>
      </DndContext>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};