"use client";

import { useBoardRealtimePresence } from "@/hooks/use-board-realtime-presence";
import { GripVertical, UserIcon } from "lucide-react";

interface CardDraggingIndicatorProps {
  cardId: string;
  realtimePresence: ReturnType<typeof useBoardRealtimePresence>;
}

export const CardDraggingIndicator = ({
  cardId,
  realtimePresence,
}: CardDraggingIndicatorProps) => {
  const isDragging = realtimePresence?.isDraggingCardByOthers(cardId);
  const draggingUser = realtimePresence?.getUserDraggingCard(cardId);

  if (!isDragging || !draggingUser) return null;

  return (
    <div
      className="absolute -top-2 left-2 z-20 rounded-md border-2 shadow-lg"
      style={{
        borderColor: draggingUser.user.color,
      }}
    >
      <div
        className="px-2.5 py-1 rounded-sm text-xs font-medium text-white flex items-center gap-1.5"
        style={{
          backgroundColor: draggingUser.user.color,
        }}
      >
        <GripVertical className="h-3 w-3" />
        <span>{draggingUser.user.name} is moving...</span>
      </div>
    </div>
  );
};

interface CardEditingIndicatorProps {
  cardId: string;
  realtimePresence: ReturnType<typeof useBoardRealtimePresence>;
}

export const CardEditingIndicator = ({
  cardId,
  realtimePresence,
}: CardEditingIndicatorProps) => {
  const editingUsers = realtimePresence?.getEditingUsers(cardId) || [];

  if (editingUsers.length === 0) return null;

  return (
    <div className="absolute -top-2 right-2 z-20 flex gap-1">
      {editingUsers.map((editingUser) => (
        <div
          key={editingUser.connectionId}
          className="px-2.5 py-1 rounded-md text-xs font-medium text-white shadow-md flex items-center gap-1.5"
          style={{
            backgroundColor: editingUser.user.color,
          }}
        >
          <UserIcon className="h-3 w-3" />
          <span>{editingUser.user.name}</span>
        </div>
      ))}
    </div>
  );
};
