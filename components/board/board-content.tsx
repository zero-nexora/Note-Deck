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
import { useCard } from "@/hooks/use-card";
import { useList } from "@/hooks/use-list";
import { LiveCursors } from "./live-cursors";
import { LiveDragOverlay } from "./live-drap-overlay";
import { ListColumn } from "./list-comlumn";
import { CreateListInput } from "@/domain/schemas/list.schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CardItem } from "./card-item";

interface BoardContentProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardContent = ({ board }: BoardContentProps) => {

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"card" | "list" | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const { moveCard } = useCard();
  const { moveList, createList } = useList();

  const { startDragging, updateDragging, stopDragging } = useBoardRealtime();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const handleAddList = async () => {
    const input: CreateListInput = {
      boardId: board.id,
      name: newListTitle,
      position: board.lists.length,
    };
    await createList(input);
    setNewListTitle("");
    setIsAddingList(false);
  };

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

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeType === "card" && activeData?.card) {
      const card = activeData.card;

      if (overData?.type === "list") {
        await moveCard({
          id: card.id,
          sourceListId: card.listId,
          destinationListId: over.id as string,
          position: 0,
        });
      }

      if (overData?.type === "card") {
        await moveCard({
          id: card.id,
          sourceListId: card.listId,
          destinationListId: overData.card.listId,
          position: overData.card.position,
        });
      }
    }

    if (activeType === "list" && activeData?.list && overData?.list) {
      await moveList({
        id: activeData.list.id,
        position: overData.list.position,
      });
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
        <LiveCursors />
        <LiveDragOverlay board={board} />

        <div className="flex-1 flex gap-4 p-4 overflow-x-auto h-full">
          <SortableContext
            items={board.lists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists.map((list) => (
              <ListColumn key={list.id} list={list} />
            ))}
          </SortableContext>

          <div className="w-72 shrink-0">
            {isAddingList ? (
              <div className="bg-secondary/50 rounded-xl border border-border/50 p-3 space-y-2">
                <Input
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                    if (e.key === "Escape") setIsAddingList(false);
                  }}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleAddList}>
                    Add list
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsAddingList(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsAddingList(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add another list
              </Button>
            )}
          </div>
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
