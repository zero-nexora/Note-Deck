"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useBoardDragDropRealtime } from "@/hooks/use-board-drag-drop-realtime";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { BoardLists } from "./board-lists";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { BoardOverlay } from "./board-overlay";

interface BoardContentProps {
  board: BoardWithListColumnLabelAndMember;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardContent = ({ board, realtimeUtils }: BoardContentProps) => {
  const {
    lists,
    activeCard,
    activeList,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragDropRealtime({ board, realtimeUtils });

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
          <BoardLists board={updatedBoard} realtimeUtils={realtimeUtils} />
        </div>

        <BoardOverlay
          realtimeUtils={realtimeUtils}
          activeCard={activeCard}
          activeList={activeList}
        />
      </DndContext>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
