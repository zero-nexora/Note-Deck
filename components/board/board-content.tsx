"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { useCallback, useState } from "react";
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
  UniqueIdentifier,
  DragOverEvent,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CardItem } from "./card-item";
import { BoardListColumn } from "./board-list-column";
import { CreateList } from "./create-list";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { LiveCursors } from "./live-cursors";
import { LiveDragOverlay } from "./live-drap-overlay";

interface BoardContentProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardContent = ({ board }: BoardContentProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"card" | "list" | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const { startDragging, updateDragging, stopDragging } = useBoardRealtime();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const resetDragState = () => {
    setActiveId(null);
    setActiveType(null);
    setOverId(null);
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

      if (!over) {
        setOverId(null);
        return;
      }

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) {
        setOverId(null);
        return;
      }

      setOverId(overId);

      const activeData = active.data.current;
      const overData = over.data.current;

      const isCardOverList =
        activeData?.type === "card" && overData?.type === "list";
      const isListOverCard =
        activeData?.type === "list" && overData?.type === "card";

      if (isListOverCard) {
        return;
      }

      if (activeData?.type === "card") {
        const activeCard = activeData.card;
        const sourceListId = activeCard.listId;

        if (overData?.type === "card") {
          const overCard = overData.card;
          const destinationListId = overCard.listId;

          if (sourceListId === destinationListId) {
            const listIndex = board.lists.findIndex(
              (l) => l.id === sourceListId
            );
            if (listIndex === -1) return;

            const list = board.lists[listIndex];
            const oldCardIndex = list.cards.findIndex(
              (c) => c.id === activeCard.id
            );
            const newCardIndex = list.cards.findIndex(
              (c) => c.id === overCard.id
            );

            if (
              oldCardIndex !== -1 &&
              newCardIndex !== -1 &&
              oldCardIndex !== newCardIndex
            ) {
              const reorderedCards = arrayMove(
                list.cards,
                oldCardIndex,
                newCardIndex
              );

              reorderedCards.forEach((card, index) => {
                card.position = index;
              });

              list.cards.splice(0, list.cards.length, ...reorderedCards);
            }
          } else {
            const sourceListIndex = board.lists.findIndex(
              (l) => l.id === sourceListId
            );
            const destinationListIndex = board.lists.findIndex(
              (l) => l.id === destinationListId
            );

            if (sourceListIndex === -1 || destinationListIndex === -1) return;

            const sourceList = board.lists[sourceListIndex];
            const destinationList = board.lists[destinationListIndex];

            const sourceCardIndex = sourceList.cards.findIndex(
              (c) => c.id === activeCard.id
            );
            const destinationCardIndex = destinationList.cards.findIndex(
              (c) => c.id === overCard.id
            );

            if (sourceCardIndex === -1) return;

            const cardAlreadyInDestination = destinationList.cards.some(
              (c) => c.id === activeCard.id
            );

            if (cardAlreadyInDestination) {
              const oldIndex = destinationList.cards.findIndex(
                (c) => c.id === activeCard.id
              );
              const newIndex = destinationCardIndex;

              if (oldIndex !== newIndex) {
                const reorderedCards = arrayMove(
                  destinationList.cards,
                  oldIndex,
                  newIndex
                );

                reorderedCards.forEach((card, index) => {
                  card.position = index;
                });

                destinationList.cards.splice(
                  0,
                  destinationList.cards.length,
                  ...reorderedCards
                );
              }
            } else {
              const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);

              movedCard.listId = destinationListId;

              const insertIndex =
                destinationCardIndex !== -1
                  ? destinationCardIndex
                  : destinationList.cards.length;
              destinationList.cards.splice(insertIndex, 0, movedCard);

              sourceList.cards.forEach((card, index) => {
                card.position = index;
              });

              destinationList.cards.forEach((card, index) => {
                card.position = index;
              });
            }
          }
        }

        if (isCardOverList) {
          const destinationListId = overId as string;

          if (sourceListId !== destinationListId) {
            const sourceListIndex = board.lists.findIndex(
              (l) => l.id === sourceListId
            );
            const destinationListIndex = board.lists.findIndex(
              (l) => l.id === destinationListId
            );

            if (sourceListIndex === -1 || destinationListIndex === -1) return;

            const sourceList = board.lists[sourceListIndex];
            const destinationList = board.lists[destinationListIndex];

            const sourceCardIndex = sourceList.cards.findIndex(
              (c) => c.id === activeCard.id
            );
            if (sourceCardIndex === -1) return;

            const cardAlreadyInDestination = destinationList.cards.some(
              (c) => c.id === activeCard.id
            );

            if (!cardAlreadyInDestination) {
              const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);

              movedCard.listId = destinationListId;

              destinationList.cards.push(movedCard);

              sourceList.cards.forEach((card, index) => {
                card.position = index;
              });

              destinationList.cards.forEach((card, index) => {
                card.position = index;
              });
            }
          }
        }
      }

      if (activeData?.type === "list" && overData?.type === "list") {
        const oldIndex = board.lists.findIndex((l) => l.id === activeId);
        const newIndex = board.lists.findIndex((l) => l.id === overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reorderedLists = arrayMove(board.lists, oldIndex, newIndex);

          reorderedLists.forEach((list, index) => {
            list.position = index;
          });

          board.lists.splice(0, board.lists.length, ...reorderedLists);
        }
      }
    },
    [board.lists]
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    stopDragging();

    if (!over) {
      resetDragState();
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      resetDragState();
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "list" && overData?.type === "list") {
      const oldIndex = board.lists.findIndex((l) => l.id === activeId);
      const newIndex = board.lists.findIndex((l) => l.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedLists = arrayMove(board.lists, oldIndex, newIndex);

        reorderedLists.forEach((list, index) => {
          list.position = index;
        });

        board.lists.splice(0, board.lists.length, ...reorderedLists);
      }
    }

    if (activeData?.type === "card") {
      const activeCard = activeData.card;

      if (overData?.type === "card") {
        const overCard = overData.card;
        const activeListId = activeCard.listId;
        const overListId = overCard.listId;

        if (activeListId === overListId) {
          const listIndex = board.lists.findIndex((l) => l.id === activeListId);
          if (listIndex === -1) {
            resetDragState();
            return;
          }

          const list = board.lists[listIndex];
          const oldCardIndex = list.cards.findIndex((c) => c.id === activeId);
          const newCardIndex = list.cards.findIndex((c) => c.id === overId);

          if (
            oldCardIndex !== -1 &&
            newCardIndex !== -1 &&
            oldCardIndex !== newCardIndex
          ) {
            const reorderedCards = arrayMove(
              list.cards,
              oldCardIndex,
              newCardIndex
            );

            reorderedCards.forEach((card, index) => {
              card.position = index;
            });

            list.cards.splice(0, list.cards.length, ...reorderedCards);
          }
        } else {
          const sourceListIndex = board.lists.findIndex(
            (l) => l.id === activeListId
          );
          const destinationListIndex = board.lists.findIndex(
            (l) => l.id === overListId
          );

          if (sourceListIndex === -1 || destinationListIndex === -1) {
            resetDragState();
            return;
          }

          const sourceList = board.lists[sourceListIndex];
          const destinationList = board.lists[destinationListIndex];

          const sourceCardIndex = sourceList.cards.findIndex(
            (c) => c.id === activeId
          );
          const destinationCardIndex = destinationList.cards.findIndex(
            (c) => c.id === overId
          );

          if (sourceCardIndex === -1) {
            resetDragState();
            return;
          }

          const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);
          movedCard.listId = overListId;

          const insertIndex =
            destinationCardIndex === -1
              ? destinationList.cards.length
              : destinationCardIndex;
          destinationList.cards.splice(insertIndex, 0, movedCard);

          sourceList.cards.forEach((card, index) => {
            card.position = index;
          });

          destinationList.cards.forEach((card, index) => {
            card.position = index;
          });
        }
      }

      if (overData?.type === "list") {
        const activeListId = activeCard.listId;
        const destinationListId = overId;

        if (activeListId !== destinationListId) {
          const sourceListIndex = board.lists.findIndex(
            (l) => l.id === activeListId
          );

          const destinationListIndex = board.lists.findIndex(
            (l) => l.id === destinationListId
          );

          if (sourceListIndex === -1 || destinationListIndex === -1) {
            resetDragState();
            return;
          }

          const sourceList = board.lists[sourceListIndex];
          const destinationList = board.lists[destinationListIndex];

          const sourceCardIndex = sourceList.cards.findIndex(
            (c) => c.id === activeId
          );

          if (sourceCardIndex === -1) {
            resetDragState();
            return;
          }

          const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);
          movedCard.listId = destinationListId as string;

          destinationList.cards.push(movedCard);

          sourceList.cards.forEach((card, index) => {
            card.position = index;
          });

          destinationList.cards.forEach((card, index) => {
            card.position = index;
          });
        }
      }
    }

    resetDragState();
  };

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
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-screen">
        <DndContext
          sensors={sensors}
          collisionDetection={(args) => {
            const pointerCollisions = pointerWithin(args);
            if (pointerCollisions.length > 0) {
              return pointerCollisions;
            }

            return closestCorners(args);
          }}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="relative h-full">
            <LiveCursors />
            <LiveDragOverlay board={board} />

            <div className="flex gap-4 p-4 h-full items-start">
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

            <DragOverlay
              dropAnimation={{
                duration: 200,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {activeCard ? (
                <div className="cursor-grabbing">
                  <CardItem card={activeCard} isDragging isOverlay />
                </div>
              ) : activeList ? (
                <div className="cursor-grabbing opacity-90">
                  <BoardListColumnOverlay list={activeList} />
                </div>
              ) : null}
            </DragOverlay>
          </div>
        </DndContext>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

const BoardListColumnOverlay = ({
  list,
}: {
  list: BoardWithListColumnLabelAndMember["lists"][number];
}) => {
  return (
    <div className="w-72 shrink-0 flex flex-col glass-card">
      <div className="p-3 border-b border-border/30">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="truncate">{list.name}</span>
          <span className="text-xs text-muted-foreground font-normal shrink-0 px-1.5 py-0.5 rounded-full bg-muted/50">
            {list.cards.length}
          </span>
        </h3>
      </div>
      <div className="p-2 space-y-2 max-h-[300px] overflow-hidden">
        {list.cards.slice(0, 3).map((card) => (
          <CardItem key={card.id} card={card} isPreview />
        ))}
        {list.cards.length > 3 && (
          <div className="text-xs text-muted-foreground text-center py-2 bg-muted/30 rounded">
            +{list.cards.length - 3} more cards
          </div>
        )}
      </div>
    </div>
  );
};
