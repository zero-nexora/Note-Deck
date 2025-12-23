"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

interface CardItemProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
}

export const CardItem = ({ card }: CardItemProps) => {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div className="bg-background/50 p-2 rounded-lg">
      {card.title}
    </div>
  );
};
