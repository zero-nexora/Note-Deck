"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { useBoardDragDropRealtime } from "@/hooks/use-board-drag-drop-realtime";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  pointerWithin,
  rectIntersection,
  closestCenter,
  CollisionDetection,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { BoardLists } from "./board-lists";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { BoardOverlay } from "./board-overlay";
import { useBoardRealtimePresence } from "@/hooks/use-board-realtime-presence";
import { User } from "@/domain/types/user.type";

interface BoardContentProps {
  board: BoardWithListLabelsAndMembers;
  user: User;
}

const collisionDetection: CollisionDetection = (args) => {
  const pointer = pointerWithin(args);
  if (pointer.length > 0) return pointer;

  const rect = rectIntersection(args);
  if (rect.length > 0) return rect;

  return closestCenter(args);
};

export const BoardContent = ({ board, user }: BoardContentProps) => {
  const realtimePresence = useBoardRealtimePresence();

  const {
    lists,
    activeCard,
    activeList,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragDropRealtime({
    board,
    realtimeUtils: realtimePresence,
    user,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const updatedBoard = {
    ...board,
    lists,
  };

  return (
    <ScrollArea className="flex-1 bg-background">
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        measuring={measuring}
        autoScroll={{
          enabled: true,
          threshold: { x: 0.2, y: 0.2 },
          acceleration: 10,
        }}
      >
        <div className="h-full">
          <BoardLists board={updatedBoard} user={user} />
        </div>

        <BoardOverlay
          activeCard={activeCard}
          activeList={activeList}
          user={user}
        />
      </DndContext>

      <ScrollBar orientation="horizontal" className="bg-muted" />
    </ScrollArea>
  );
};
