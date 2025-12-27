"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardCardCover } from "./board-card-cover";
import { BoardCardContent } from "./board-card-content";

interface BoardCardItemProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
}

export const BoardCardItem = ({ card }: BoardCardItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasCover = !!card.coverImage;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative bg-card rounded-lg border border-border/50 hover:border-border transition-all duration-200 cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:-translate-y-0.5 my-2",
        isDragging && "opacity-50"
      )}
    >
      {hasCover && (
        <BoardCardCover coverImage={card.coverImage} title={card.title} />
      )}

      <BoardCardContent card={card} hasCover={hasCover} />
    </div>
  );
};