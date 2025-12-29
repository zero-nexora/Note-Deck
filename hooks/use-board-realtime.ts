import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { User } from "@/domain/types/user.type";
import { useCallback, useEffect } from "react";
import {
  useUpdateMyPresence,
  useBroadcastEvent,
  useOthers,
  useEventListener,
} from "@/lib/liveblocks";

interface UseBoardRealtimeProps {
  board: BoardWithListColumnLabelAndMember;
  user: User;
  onBoardUpdate: () => void;
}

export const useBoardRealtime = ({
  user,
  onBoardUpdate,
}: UseBoardRealtimeProps) => {
  const updateMyPresence = useUpdateMyPresence();
  const broadcast = useBroadcastEvent();
  const others = useOthers();

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      updateMyPresence({
        cursor: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    },
    [updateMyPresence]
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
      updateMyPresence({
        draggingCardId: cardId,
      });
    },
    [updateMyPresence]
  );

  const setDraggingList = useCallback(
    (listId: string | null) => {
      updateMyPresence({
        draggingListId: listId,
      });
    },
    [updateMyPresence]
  );

  const setEditingCard = useCallback(
    (cardId: string | null) => {
      updateMyPresence({
        editingCardId: cardId,
      });
    },
    [updateMyPresence]
  );

  const broadcastCardMoved = useCallback(
    (data: {
      cardId: string;
      sourceListId: string;
      destinationListId: string;
      position: number;
    }) => {
      broadcast({
        type: "CARD_MOVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastCardUpdated = useCallback(
    (data: {
      cardId: string;
      field: "title" | "description" | "dueDate" | "coverImage";
      value: any;
    }) => {
      broadcast({
        type: "CARD_UPDATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastCardCreated = useCallback(
    (data: { cardId: string; listId: string }) => {
      broadcast({
        type: "CARD_CREATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastCardDeleted = useCallback(
    (data: { cardId: string; listId: string }) => {
      broadcast({
        type: "CARD_DELETED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastListCreated = useCallback(
    (data: { listId: string }) => {
      broadcast({
        type: "LIST_CREATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastListUpdated = useCallback(
    (data: { listId: string; field: string; value: any }) => {
      broadcast({
        type: "LIST_UPDATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastListDeleted = useCallback(
    (data: { listId: string }) => {
      broadcast({
        type: "LIST_DELETED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastListMoved = useCallback(
    (data: { listId: string; position: number }) => {
      broadcast({
        type: "LIST_MOVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastLabelAdded = useCallback(
    (data: { cardId: string; labelId: string }) => {
      broadcast({
        type: "LABEL_ADDED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastLabelRemoved = useCallback(
    (data: { cardId: string; labelId: string }) => {
      broadcast({
        type: "LABEL_REMOVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastMemberAssigned = useCallback(
    (data: { cardId: string; memberId: string }) => {
      broadcast({
        type: "MEMBER_ASSIGNED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastMemberUnassigned = useCallback(
    (data: { cardId: string; memberId: string }) => {
      broadcast({
        type: "MEMBER_UNASSIGNED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastCommentAdded = useCallback(
    (data: { cardId: string; commentId: string }) => {
      broadcast({
        type: "COMMENT_ADDED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  const broadcastBoardUpdated = useCallback(
    (data: { field: string; value: any }) => {
      broadcast({
        type: "BOARD_UPDATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id]
  );

  useEventListener(({ event }) => {
    if (event.userId === user.id) return;

    console.log("Received realtime event:", event.type, event);

    onBoardUpdate();
  });

  const otherUsers = others.map((other) => ({
    connectionId: other.connectionId,
    user: other.presence.user,
    draggingCardId: other.presence.draggingCardId,
    draggingListId: other.presence.draggingListId,
    editingCardId: other.presence.editingCardId,
    cursor: other.presence.cursor,
  }));

  const isDraggingCardByOthers = (cardId: string) => {
    return otherUsers.some((other) => other.draggingCardId === cardId);
  };

  const isDraggingListByOthers = (listId: string) => {
    return otherUsers.some((other) => other.draggingListId === listId);
  };

  const isEditingByOthers = (cardId: string) => {
    return otherUsers.some((other) => other.editingCardId === cardId);
  };

  const getUserDraggingCard = (cardId: string) => {
    return otherUsers.find((other) => other.draggingCardId === cardId);
  };

  const getUserDraggingList = (listId: string) => {
    return otherUsers.find((other) => other.draggingListId === listId);
  };

  const getUserEditingCard = (cardId: string) => {
    return otherUsers.find((other) => other.editingCardId === cardId);
  };

  const canDragCard = (cardId: string) => {
    return !isDraggingCardByOthers(cardId);
  };

  const canDragList = (listId: string) => {
    return !isDraggingListByOthers(listId);
  };

  return {
    handlePointerMove,
    handlePointerLeave,

    setDraggingCard,
    setDraggingList,
    setEditingCard,

    broadcastCardMoved,
    broadcastCardUpdated,
    broadcastCardCreated,
    broadcastCardDeleted,
    broadcastListCreated,
    broadcastListUpdated,
    broadcastListDeleted,
    broadcastListMoved,
    broadcastLabelAdded,
    broadcastLabelRemoved,
    broadcastMemberAssigned,
    broadcastMemberUnassigned,
    broadcastCommentAdded,
    broadcastBoardUpdated,

    otherUsers,
    isDraggingCardByOthers,
    isDraggingListByOthers,
    isEditingByOthers,
    getUserDraggingCard,
    getUserDraggingList,
    getUserEditingCard,
    canDragCard,
    canDragList,
  };
};
