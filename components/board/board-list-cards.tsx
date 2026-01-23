"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardCardItem } from "./board-card-item";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { User } from "@/domain/types/user.type";
import { useMemo } from "react";
import { useBoardRealtimeCards } from "@/hooks/use-board-realtime-cards";

interface BoardListCardsProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  boardMembers: BoardWithListLabelsAndMembers["members"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
  user: User;
}

export const BoardListCards = ({
  list,
  boardMembers,
  boardLabels,
  user,
}: BoardListCardsProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const { isCardDeleted } = useBoardRealtimeCards({ user });

  const visibleCards = useMemo(() => {
    return list.cards.filter((card) => !isCardDeleted(card.id));
  }, [list.cards, isCardDeleted]);

  const sortedCards = useMemo(() => {
    return [...visibleCards].sort((a, b) => a.position - b.position);
  }, [visibleCards]);

  return (
    <div ref={setNodeRef}>
      <div
        className={cn(
          "space-y-2 min-h-[100px] rounded-lg transition-colors p-2",
          isOver && "bg-primary/5",
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
              user={user}
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
