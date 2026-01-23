import { useCallback, useEffect } from "react";
import { useUpdateMyPresence, useOthers } from "@/lib/liveblocks";

export const useBoardRealtimePresence = () => {
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      updateMyPresence({
        cursor: {
          x: e.clientX - 300,
          y: e.clientY - 100,
        },
      });
    },
    [updateMyPresence],
  );

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({
      cursor: null,
    });
  }, [updateMyPresence]);

  useEffect(() => {
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave]);

  const setDraggingCard = useCallback(
    (cardId: string | null) => {
      updateMyPresence({ draggingCardId: cardId });
    },
    [updateMyPresence],
  );

  const setDraggingList = useCallback(
    (listId: string | null) => {
      updateMyPresence({ draggingListId: listId });
    },
    [updateMyPresence],
  );

  const setEditingCard = useCallback(
    (cardId: string | null) => {
      updateMyPresence({ editingCardId: cardId });
    },
    [updateMyPresence],
  );

  const otherUsers = others.map((other) => ({
    connectionId: other.connectionId,
    user: other.presence.user,
    draggingCardId: other.presence.draggingCardId,
    draggingListId: other.presence.draggingListId,
    editingCardId: other.presence.editingCardId,
    cursor: other.presence.cursor,
  }));

  const isDraggingCardByOthers = useCallback(
    (cardId: string) =>
      otherUsers.some((other) => other.draggingCardId === cardId),
    [otherUsers],
  );

  const isDraggingListByOthers = useCallback(
    (listId: string) =>
      otherUsers.some((other) => other.draggingListId === listId),
    [otherUsers],
  );

  const getEditingUsers = useCallback(
    (cardId: string) =>
      otherUsers.filter((other) => other.editingCardId === cardId),
    [otherUsers],
  );

  const getUserDraggingCard = useCallback(
    (cardId: string) =>
      otherUsers.find((other) => other.draggingCardId === cardId),
    [otherUsers],
  );

  const getUserDraggingList = useCallback(
    (listId: string) =>
      otherUsers.find((other) => other.draggingListId === listId),
    [otherUsers],
  );

  const canDragCard = useCallback(
    (cardId: string) => !isDraggingCardByOthers(cardId),
    [isDraggingCardByOthers],
  );

  const canDragList = useCallback(
    (listId: string) => !isDraggingListByOthers(listId),
    [isDraggingListByOthers],
  );

  return {
    handlePointerMove,
    handlePointerLeave,
    setDraggingCard,
    setDraggingList,
    setEditingCard,
    otherUsers,
    isDraggingCardByOthers,
    isDraggingListByOthers,
    getEditingUsers,
    getUserDraggingCard,
    getUserDraggingList,
    canDragCard,
    canDragList,
  };
};
