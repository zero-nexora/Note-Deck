"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardCardCover } from "./board-card-cover";
import { BoardCardContent } from "./board-card-content";

interface BoardCardItemProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
  isPreview?: boolean;
  isOverlay?: boolean;
}

export const BoardCardItem = ({
  card,
  isPreview = false,
  isOverlay = false,
}: BoardCardItemProps) => {
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
    disabled: isPreview || isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasCover = !!card.coverImage;

  if (isOverlay) {
    return (
      <div
        className={cn(
          "bg-card/40 rounded-lg border-2 border-primary/50",
          "backdrop-blur-sm pointer-events-none",
          hasCover ? "h-[200px]" : "h-20",
          "w-full min-w-[280px]"
        )}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative bg-card rounded-lg border border-border/50 hover:border-border transition-all duration-200 cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:-translate-y-0.5",
        isDragging && "opacity-40",
        isPreview && "pointer-events-none opacity-70"
      )}
    >
      {hasCover && (
        <BoardCardCover coverImage={card.coverImage} title={card.title} />
      )}

      <BoardCardContent card={card} hasCover={hasCover} />

      {isDragging && (
        <div className="absolute inset-0 rounded-lg border-2 border-primary/50 bg-primary/5 pointer-events-none" />
      )}
    </div>
  );
};
