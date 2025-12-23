"use client";

import { useRoom, useMyPresence, useOthers } from "@/lib/liveblocks";
import { useEffect, useCallback } from "react";
import type { DragState } from "@/lib/liveblocks";

export const useBoardRealtime = () => {
  const room = useRoom();
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

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
    },
    [updateMyPresence]
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
  }, [updateMyPresence]);

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

  return {
    room,
    myPresence,
    others: [...others],
    updateMyPresence,

    updateCursor,
    setSelectedCard,
    setEditingCard,

    startDragging,
    updateDragging,
    stopDragging,
  };
};
