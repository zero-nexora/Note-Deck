"use client";

import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { GripVertical } from "lucide-react";

interface CardDraggingIndicatorProps {
  cardId: string;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const CardDraggingIndicator = ({
  cardId,
  realtimeUtils,
}: CardDraggingIndicatorProps) => {
  const isDragging = realtimeUtils?.isDraggingCardByOthers(cardId);
  const draggingUser = realtimeUtils?.getUserDraggingCard(cardId);

  if (!isDragging || !draggingUser) return null;

  return (
    <div
      style={{
        borderColor: draggingUser.user.color,
      }}
    >
      <div
        style={{
          backgroundColor: draggingUser.user.color,
        }}
      >
        <GripVertical />
        <span>{draggingUser.user.name} is moving...</span>
      </div>
    </div>
  );
};

interface CardEditingIndicatorProps {
  cardId: string;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const CardEditingIndicator = ({
  cardId,
  realtimeUtils,
}: CardEditingIndicatorProps) => {
  const isEditing = realtimeUtils?.isEditingByOthers(cardId);
  const editingUser = realtimeUtils?.getUserEditingCard(cardId);

  if (!isEditing || !editingUser) return null;

  return (
    <div
      style={{
        backgroundColor: editingUser.user.color,
      }}
    >
      <span >✏️</span>
      <span >{editingUser.user.name}</span>
    </div>
  );
};
