"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardCardCover } from "./board-card-cover";
import { BoardCardContent } from "./board-card-content";
import { useSheet } from "@/stores/sheet-store";
import { BoardCardItemDetail } from "./board-card-item-detail";
import { useEffect } from "react";
import { useCard } from "@/hooks/use-card";
import { useConfirm } from "@/stores/confirm-store";
import { Archive, Copy, RotateCcw, Trash2 } from "lucide-react";
import { ActionsMenu } from "../common/actions-menu";
import { useBoardRealtimePresence } from "@/hooks/use-board-realtime-presence";
import { useBoardRealtimeCards } from "@/hooks/use-board-realtime-cards";
import { User } from "@/domain/types/user.type";
import {
  CardDraggingIndicator,
  CardEditingIndicator,
} from "./card-dragging-indicator";

interface BoardCardItemProps {
  card: BoardWithListLabelsAndMembers["lists"][number]["cards"][number];
  boardMembers: BoardWithListLabelsAndMembers["members"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
  user: User;
}

export const BoardCardItem = ({
  card,
  boardMembers = [],
  boardLabels = [],
  user,
}: BoardCardItemProps) => {
  const { open, isOpen } = useSheet();
  const { deleteCard, duplicateCard, archiveCard, restoreCard } = useCard();
  const { open: openConfirm } = useConfirm();

  const realtimePresence = useBoardRealtimePresence();
  const {
    broadcastCardDeleted,
    broadcastCardArchived,
    broadcastCardRestored,
    broadcastCardDuplicated,
  } = useBoardRealtimeCards({ user });

  const isDraggingByOthers = realtimePresence.isDraggingCardByOthers(card.id);
  const canDrag = realtimePresence.canDragCard(card.id);

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
      realtimePresence.setEditingCard(null);
    }
  }, [isOpen, realtimePresence]);

  const hasCover = !!card.coverImage;

  const handleViewDetailCard = () => {
    if (isDraggingByOthers) return;

    realtimePresence.setEditingCard(card.id);

    open({
      title: "Card Details",
      description: "Detailed information for this card",
      children: (
        <BoardCardItemDetail
          boardMembers={boardMembers}
          boardLabels={boardLabels}
          cardId={card.id}
        />
      ),
    });
  };

  const handleDuplicate = async () => {
    const result = await duplicateCard({ id: card.id });
    if (result) {
      broadcastCardDuplicated(result);
    }
  };

  const handleDelete = () => {
    openConfirm({
      title: "Delete card",
      description: "Are you sure you want to delete this card?",
      variant: "destructive",
      onConfirm: async () => {
        const result = await deleteCard({ id: card.id });
        if (result) {
          broadcastCardDeleted(card.id, card.listId);
        }
      },
    });
  };

  const handleArchive = async () => {
    const result = await archiveCard({ id: card.id });
    if (result) {
      broadcastCardArchived(card.id, card.listId);
    }
  };

  const handleRestore = async () => {
    const result = await restoreCard({ id: card.id });
    if (result) {
      broadcastCardRestored(card.id, card.listId);
    }
  };

  const actions = [
    {
      label: "Duplicate",
      icon: Copy,
      onClick: handleDuplicate,
    },
    {
      label: card.isArchived ? "Restore" : "Archive",
      icon: card.isArchived ? RotateCcw : Archive,
      onClick: card.isArchived ? handleRestore : handleArchive,
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive" as const,
      onClick: handleDelete,
      separator: true,
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
        isDraggingByOthers && "cursor-not-allowed opacity-60",
      )}
      onClick={handleViewDetailCard}
    >
      <CardDraggingIndicator
        cardId={card.id}
        realtimePresence={realtimePresence}
      />

      <CardEditingIndicator
        cardId={card.id}
        realtimePresence={realtimePresence}
      />

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
