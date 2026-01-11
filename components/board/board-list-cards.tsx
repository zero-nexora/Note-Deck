"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardCardItem } from "./board-card-item";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardListCardsProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  boardMembers: BoardWithListLabelsAndMembers["members"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardListCards = ({
  list,
  boardMembers,
  boardLabels,
  realtimeUtils,
}: BoardListCardsProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const sortedCards = [...list.cards].sort((a, b) => a.position - b.position);

  return (
    <div ref={setNodeRef} className="p-2">
      <div
        className={cn(
          "space-y-2 min-h-[100px] rounded-lg transition-colors",
          isOver && "bg-primary/5"
        )}
      >
        <SortableContext
          items={sortedCards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedCards.map((card) => (
            <BoardCardItem
              boardMembers={boardMembers}
              boardLabels={boardLabels}
              key={card.id}
              card={card}
              realtimeUtils={realtimeUtils}
            />
          ))}
        </SortableContext>

        {sortedCards.length === 0 && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
};
