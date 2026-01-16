"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardCardCover } from "./board-card-cover";
import { BoardCardContent } from "./board-card-content";
import { useSheet } from "@/stores/sheet-store";
import { BoardCardItemDetail } from "./board-card-item-detail";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { useEffect } from "react";
import { useCard } from "@/hooks/use-card";
import { useConfirm } from "@/stores/confirm-store";
import { Copy, Trash2, User } from "lucide-react";
import { ActionsMenu } from "../common/actions-menu";

interface BoardCardItemProps {
  card: BoardWithListLabelsAndMembers["lists"][number]["cards"][number];
  boardMembers: BoardWithListLabelsAndMembers["members"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardCardItem = ({
  card,
  boardMembers = [],
  boardLabels = [],
  realtimeUtils,
}: BoardCardItemProps) => {
  const { open, isOpen } = useSheet();
  const { deleteCard, duplicateCard } = useCard();
  const { open: openConfirm } = useConfirm();

  const isDraggingByOthers = realtimeUtils?.isDraggingCardByOthers(card.id);
  const draggingUser = realtimeUtils?.getUserDraggingCard(card.id);
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
    if (isDraggingByOthers) return;

    realtimeUtils?.setEditingCard(card.id);

    open({
      title: "Card Details",
      description: "",
      children: (
        <BoardCardItemDetail
          boardMembers={boardMembers}
          boardLabels={boardLabels}
          cardId={card.id}
          realtimeUtils={realtimeUtils}
        />
      ),
    });
  };

  const handleDuplicate = async () => {
    await duplicateCard({ id: card.id });
    realtimeUtils?.broadcastCardDuplicate({
      sourceCardId: card.id,
      listId: card.listId,
    });
  };

  const handleDelete = () => {
    openConfirm({
      title: "Delete card",
      description: "Are you sure you want to delete this card?",
      variant: "destructive",
      onConfirm: async () => {
        await deleteCard({ id: card.id });
        realtimeUtils?.broadcastCardDeleted({
          cardId: card.id,
          listId: card.listId,
        });
      },
    });
  };

  const actions = [
    {
      label: "Duplicate",
      icon: Copy,
      onClick: handleDuplicate,
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive" as const,
      onClick: handleDelete,
    },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(canDrag ? listeners : {})}
      className={cn(
        "group relative rounded-lg bg-card border shadow-sm transition-all",
        canDrag &&
          !isDraggingByOthers &&
          "cursor-grab hover:border-primary/50 hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-50",
        isDraggingByOthers && "cursor-not-allowed opacity-60"
      )}
      onClick={handleViewDetailCard}
    >
      {isDraggingByOthers && draggingUser && (
        <div
          className="absolute -top-2 left-2 z-20 px-2.5 py-1 rounded-md text-xs font-medium text-white shadow-md flex items-center gap-1.5"
          style={{ backgroundColor: draggingUser.user.color }}
        >
          <User className="h-3 w-3" />
          <span>{draggingUser.user.name}</span>
        </div>
      )}

      {!isDraggingByOthers && (
        <div
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <ActionsMenu
            actions={actions}
            triggerClassName="h-7 w-7 bg-background/95 backdrop-blur hover:bg-accent shadow-sm"
          />
        </div>
      )}

      {hasCover && (
        <BoardCardCover coverImage={card.coverImage} title={card.title} />
      )}

      <BoardCardContent card={card} hasCover={hasCover} />
    </div>
  );
};
