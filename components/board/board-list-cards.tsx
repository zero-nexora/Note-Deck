"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardCardItem } from "./board-card-item";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface BoardListCardsProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
}

export const BoardListCards = ({ list }: BoardListCardsProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const sortedCards = [...list.cards].sort((a, b) => a.position - b.position);

  return (
    <div ref={setNodeRef} className="flex-1 overflow-y-auto overflow-x-hidden p-1">
      <div
        className={cn(
          "space-y-2 p-1 min-h-[100px] transition-colors",
          isOver && "bg-primary/5 rounded-lg"
        )}
      >
        <SortableContext
          items={sortedCards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedCards.map((card) => (
            <BoardCardItem key={card.id} card={card} />
          ))}
        </SortableContext>

        {sortedCards.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border-2 border-dashed border-border/50 rounded-lg bg-muted/20">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
};
