"use client";

import {
  useRoom,
  useMyPresence,
  useOthers,
  useBroadcastEvent,
} from "@/lib/liveblocks";
import { useEffect, useCallback } from "react";
import type { DragState } from "@/lib/liveblocks";

export const useBoardRealtime = () => {
  const room = useRoom();
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const broadcast = useBroadcastEvent();

  const updateCursor = useCallback(
    (cursor: { x: number; y: number } | null) => {
      updateMyPresence({ cursor });
    },
    [updateMyPresence]
  );

  const setSelectedCard = useCallback(
    (cardId: string | null) => {
      updateMyPresence({ selectedCardId: cardId });
    },
    [updateMyPresence]
  );

  const setEditingCard = useCallback(
    (cardId: string | null, field: string | null) => {
      updateMyPresence({
        editingCardId: cardId,
        editingField: field,
      });
    },
    [updateMyPresence]
  );

  const startDragging = useCallback(
    (
      type: "card" | "list",
      draggingId: string,
      dragOffset: { x: number; y: number },
      pointer: { x: number; y: number },
      sourceListId?: string | null,
      sourcePosition?: number | null
    ) => {
      const dragState: DragState = {
        isDragging: true,
        dragType: type,
        draggingId,
        dragOffset,
        pointer,
        sourceListId: sourceListId ?? null,
        sourcePosition: sourcePosition ?? null,
      };

      updateMyPresence({ dragState });

      broadcast({
        type: type === "card" ? "CARD_MOVED" : "LIST_MOVED",
        data: {
          action: "drag_start",
          id: draggingId,
          sourceListId,
          sourcePosition,
        },
      });
    },
    [updateMyPresence, broadcast]
  );

  const updateDragging = useCallback(
    (pointer: { x: number; y: number }) => {
      if (!myPresence.dragState.isDragging) return;

      updateMyPresence({
        dragState: {
          ...myPresence.dragState,
          pointer,
        },
      });
    },
    [myPresence.dragState, updateMyPresence]
  );

  const stopDragging = useCallback(() => {
    const currentDragState = myPresence.dragState;

    if (currentDragState.isDragging) {
      broadcast({
        type:
          currentDragState.dragType === "card" ? "CARD_MOVED" : "LIST_MOVED",
        data: {
          action: "drag_end",
          id: currentDragState.draggingId,
          sourceListId: currentDragState.sourceListId,
          sourcePosition: currentDragState.sourcePosition,
        },
      });
    }

    updateMyPresence({
      dragState: {
        isDragging: false,
        dragType: null,
        draggingId: null,
        dragOffset: null,
        pointer: null,
        sourceListId: null,
        sourcePosition: null,
      },
    });
  }, [myPresence.dragState, updateMyPresence, broadcast]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateCursor({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      updateCursor(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [updateCursor]);

  const activeDraggers = useCallback(() => {
    const draggers: Array<{
      connectionId: number;
      user: any;
      dragState: DragState;
    }> = [];

    others.forEach((other) => {
      if (other.presence.dragState.isDragging) {
        draggers.push({
          connectionId: other.connectionId,
          user: other.presence.user,
          dragState: other.presence.dragState,
        });
      }
    });

    if (myPresence.dragState.isDragging) {
      draggers.push({
        connectionId: -1,
        user: myPresence.user,
        dragState: myPresence.dragState,
      });
    }

    return draggers;
  }, [others, myPresence]);

  return {
    room,
    myPresence,
    others: [...others],
    updateMyPresence,
    activeDraggers,

    updateCursor,
    setSelectedCard,
    setEditingCard,

    startDragging,
    updateDragging,
    stopDragging,
  };
};
