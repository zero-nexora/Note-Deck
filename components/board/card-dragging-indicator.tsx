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
      className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-lg border-2 border-dashed z-10 flex items-center justify-center pointer-events-none"
      style={{
        borderColor: draggingUser.user.color,
      }}
    >
      <div
        className="px-3 py-1.5 rounded-md text-xs font-semibold text-white shadow-lg flex items-center gap-1.5"
        style={{
          backgroundColor: draggingUser.user.color,
        }}
      >
        <GripVertical className="w-3.5 h-3.5 animate-pulse" />
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
      className="absolute -top-1.5 -right-1.5 px-2 py-1 rounded-md text-xs font-semibold text-white shadow-lg flex items-center gap-1 z-20 pointer-events-none border border-white/20"
      style={{
        backgroundColor: editingUser.user.color,
      }}
    >
      <span className="text-[10px] animate-pulse">✏️</span>
      <span className="text-[10px]">{editingUser.user.name}</span>
    </div>
  );
};
