"use client";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { User } from "lucide-react";

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
      className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] rounded-lg border-2 border-dashed z-10 flex items-center justify-center pointer-events-none"
      style={{
        borderColor: draggingUser.user.color,
      }}
    >
      <div
        className="px-3 py-2 rounded-md text-sm font-medium text-foreground shadow-lg flex items-center gap-2"
        style={{
          backgroundColor: draggingUser.user.color,
        }}
      >
        <User className="w-4 h-4" />
        <span>{draggingUser.user.name} is dragging...</span>
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
      className="absolute -top-2 -right-2 px-2 py-1 rounded-md text-xs font-medium text-foreground shadow-lg flex items-center gap-1 z-20 pointer-events-none"
      style={{
        backgroundColor: editingUser.user.color,
      }}
    >
      <span className="animate-pulse">✍️</span>
      <span>{editingUser.user.name}</span>
    </div>
  );
};
