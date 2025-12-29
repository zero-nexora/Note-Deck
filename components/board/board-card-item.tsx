"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardCardCover } from "./board-card-cover";
import { BoardCardContent } from "./board-card-content";
import { useSheet } from "@/stores/sheet-store";
import { BoardCardItemDetail } from "./board-card-item-detail";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import {
  CardDraggingIndicator,
  CardEditingIndicator,
} from "./card-dragging-indicator";
import { useEffect } from "react";

interface BoardCardItemProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  boardLabels: BoardWithListColumnLabelAndMember["labels"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardCardItem = ({
  card,
  boardMembers = [],
  boardLabels = [],
  realtimeUtils,
}: BoardCardItemProps) => {
  const { open, isOpen } = useSheet();

  const isDraggingByOthers = realtimeUtils?.isDraggingCardByOthers(card.id);
  const canDrag = realtimeUtils?.canDragCard(card.id) ?? true;

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
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (!isOpen) {
      realtimeUtils?.setEditingCard(null);
    }
  }, [isOpen]);

  const hasCover = !!card.coverImage;

  const handleViewDetailCard = () => {
    realtimeUtils?.setEditingCard(card.id);

    open({
      title: "Detail Card",
      description: "",
      children: (
        <BoardCardItemDetail
          boardMembers={boardMembers}
          boardLabels={boardLabels}
          card={card}
          realtimeUtils={realtimeUtils}
        />
      ),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(canDrag ? listeners : {})}
      className={cn(
        "group relative bg-card rounded-lg border border-border/50 hover:border-border transition-all duration-200",
        canDrag && "cursor-grab active:cursor-grabbing",
        !canDrag && "cursor-not-allowed",
        "hover:shadow-md hover:-translate-y-0.5 my-2",
        isDragging && "opacity-50",
        isDraggingByOthers && "opacity-70"
      )}
      onClick={handleViewDetailCard}
    >
      {hasCover && (
        <BoardCardCover coverImage={card.coverImage} title={card.title} />
      )}

      <BoardCardContent card={card} hasCover={hasCover} />

      <CardDraggingIndicator cardId={card.id} realtimeUtils={realtimeUtils} />
      <CardEditingIndicator cardId={card.id} realtimeUtils={realtimeUtils} />
    </div>
  );
};
