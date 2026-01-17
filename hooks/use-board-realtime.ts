import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { User } from "@/domain/types/user.type";
import { useCallback, useEffect, useState } from "react";
import {
  useUpdateMyPresence,
  useBroadcastEvent,
  useOthers,
  useEventListener,
  needsRefresh,
} from "@/lib/liveblocks";

interface UseBoardRealtimeProps {
  board: BoardWithListLabelsAndMembers;
  user: User;
  onBoardUpdate: () => void;
}

export const useBoardRealtime = ({
  board,
  user,
  onBoardUpdate,
}: UseBoardRealtimeProps) => {
  const updateMyPresence = useUpdateMyPresence();
  const broadcast = useBroadcastEvent();
  const others = useOthers();

  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    cards: Map<string, Partial<any>>;
    lists: Map<string, Partial<any>>;
    labels: Map<string, Partial<any>>;
    board: Partial<any>;
  }>({
    cards: new Map(),
    lists: new Map(),
    labels: new Map(),
    board: {},
  });

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      updateMyPresence({
        cursor: {
          x: e.clientX,
          y: e.clientY,
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

  const broadcastCardCreated = useCallback(
    (data: { cardId: string; listId: string }) => {
      broadcast({
        type: "CARD_CREATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardUpdated = useCallback(
    (data: {
      cardId: string;
      listId: string;
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
    [broadcast, user.id],
  );

  const broadcastCardMoved = useCallback(
    (data: {
      cardId: string;
      sourceListId: string;
      destinationListId: string;
      sourcePosition: number;
      destinationPosition: number;
    }) => {
      broadcast({
        type: "CARD_MOVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardReordered = useCallback(
    (data: {
      listId: string;
      cardId: string;
      oldPosition: number;
      newPosition: number;
    }) => {
      broadcast({
        type: "CARD_REORDERED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardDuplicated = useCallback(
    (data: { sourceCardId: string; newCardId: string; listId: string }) => {
      broadcast({
        type: "CARD_DUPLICATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
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
    [broadcast, user.id],
  );

  const broadcastCardArchived = useCallback(
    (data: { cardId: string; listId: string }) => {
      broadcast({
        type: "CARD_ARCHIVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCardRestored = useCallback(
    (data: { cardId: string; listId: string }) => {
      broadcast({
        type: "CARD_RESTORED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
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
    [broadcast, user.id],
  );

  const broadcastListUpdated = useCallback(
    (data: { listId: string; field: "title"; value: any }) => {
      broadcast({
        type: "LIST_UPDATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastListMoved = useCallback(
    (data: { listId: string; oldPosition: number; newPosition: number }) => {
      broadcast({
        type: "LIST_MOVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastListDuplicated = useCallback(
    (data: { sourceListId: string; newListId: string }) => {
      broadcast({
        type: "LIST_DUPLICATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
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
    [broadcast, user.id],
  );

  const broadcastListArchived = useCallback(
    (data: { listId: string }) => {
      broadcast({
        type: "LIST_ARCHIVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastListRestored = useCallback(
    (data: { listId: string }) => {
      broadcast({
        type: "LIST_RESTORED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
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
    [broadcast, user.id],
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
    [broadcast, user.id],
  );

  const broadcastLabelCreated = useCallback(
    (data: { labelId: string }) => {
      broadcast({
        type: "LABEL_CREATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastLabelUpdated = useCallback(
    (data: { labelId: string; field: "name" | "color"; value: any }) => {
      broadcast({
        type: "LABEL_UPDATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastLabelDeleted = useCallback(
    (data: { labelId: string }) => {
      broadcast({
        type: "LABEL_DELETED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
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
    [broadcast, user.id],
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
    [broadcast, user.id],
  );

  const broadcastBoardMemberAdded = useCallback(
    (data: { memberId: string }) => {
      broadcast({
        type: "BOARD_MEMBER_ADDED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastBoardMemberRemoved = useCallback(
    (data: { memberId: string }) => {
      broadcast({
        type: "BOARD_MEMBER_REMOVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastBoardMemberRoleChanged = useCallback(
    (data: { memberId: string; role: string }) => {
      broadcast({
        type: "BOARD_MEMBER_ROLE_CHANGED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
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
    [broadcast, user.id],
  );

  const broadcastCommentUpdated = useCallback(
    (data: { cardId: string; commentId: string; content: string }) => {
      broadcast({
        type: "COMMENT_UPDATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCommentDeleted = useCallback(
    (data: { cardId: string; commentId: string }) => {
      broadcast({
        type: "COMMENT_DELETED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastChecklistCreated = useCallback(
    (data: { cardId: string; checklistId: string }) => {
      broadcast({
        type: "CHECKLIST_CREATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastChecklistItemToggled = useCallback(
    (data: { itemId: string; checked: boolean }) => {
      broadcast({
        type: "CHECKLIST_ITEM_TOGGLED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastAttachmentCreated = useCallback(
    (data: { cardId: string; attachmentId: string }) => {
      broadcast({
        type: "ATTACHMENT_CREATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastAttachmentDeleted = useCallback(
    (data: { attachmentId: string }) => {
      broadcast({
        type: "ATTACHMENT_DELETED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastBoardUpdated = useCallback(
    (data: { field: "title" | "description" | "background"; value: any }) => {
      broadcast({
        type: "BOARD_UPDATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCommentReactionRemoved = useCallback(
    (data: { commentId: string; reaction: string }) => {
      broadcast({
        type: "COMMENT_REACTION_REMOVED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastCommentReactionAdded = useCallback(
    (data: { commentId: string; reaction: string }) => {
      broadcast({
        type: "COMMENT_REACTION_ADDED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastChecklistItemCreated = useCallback(
    (data: { checklistId: string; itemId: string }) => {
      broadcast({
        type: "CHECKLIST_ITEM_CREATED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastChecklistItemDeleted = useCallback(
    (data: { itemId: string }) => {
      broadcast({
        type: "CHECKLIST_ITEM_DELETED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  const broadcastChecklistDeleted = useCallback(
    (data: { checklistId: string }) => {
      broadcast({
        type: "CHECKLIST_DELETED",
        ...data,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  useEventListener(({ event }) => {
    if (event.userId === user.id) return;

    switch (event.type) {
      case "CARD_UPDATED":
        setOptimisticUpdates((prev) => {
          const newCards = new Map(prev.cards);
          const existing = newCards.get(event.cardId) || {};
          newCards.set(event.cardId, {
            ...existing,
            [event.field]: event.value,
          });
          return { ...prev, cards: newCards };
        });
        break;

      case "CARD_MOVED":
      case "CARD_REORDERED":
        onBoardUpdate();
        break;

      case "LIST_UPDATED":
        setOptimisticUpdates((prev) => {
          const newLists = new Map(prev.lists);
          const existing = newLists.get(event.listId) || {};
          newLists.set(event.listId, {
            ...existing,
            [event.field]: event.value,
          });
          return { ...prev, lists: newLists };
        });
        break;

      case "LIST_MOVED":
        onBoardUpdate();
        break;

      case "LABEL_ADDED":
      case "LABEL_REMOVED":
      case "MEMBER_ASSIGNED":
      case "MEMBER_UNASSIGNED":
        onBoardUpdate();
        break;

      case "LABEL_UPDATED":
        setOptimisticUpdates((prev) => {
          const newLabels = new Map(prev.labels);
          const existing = newLabels.get(event.labelId) || {};
          newLabels.set(event.labelId, {
            ...existing,
            [event.field]: event.value,
          });
          return { ...prev, labels: newLabels };
        });
        break;

      case "BOARD_UPDATED":
        setOptimisticUpdates((prev) => ({
          ...prev,
          board: {
            ...prev.board,
            [event.field]: event.value,
          },
        }));
        break;

      case "CHECKLIST_ITEM_TOGGLED":
        onBoardUpdate();
        break;

      default:
        if (needsRefresh(event.type)) {
          onBoardUpdate();
        }
    }
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

  const getCardOptimisticValue = (cardId: string, field: string) => {
    return optimisticUpdates.cards.get(cardId)?.[field];
  };

  const getListOptimisticValue = (listId: string, field: string) => {
    return optimisticUpdates.lists.get(listId)?.[field];
  };

  const getLabelOptimisticValue = (labelId: string, field: string) => {
    return optimisticUpdates.labels.get(labelId)?.[field];
  };

  const getBoardOptimisticValue = (field: string) => {
    return optimisticUpdates.board[field];
  };

  return {
    handlePointerMove,
    handlePointerLeave,
    setDraggingCard,
    setDraggingList,
    setEditingCard,

    broadcastCardCreated,
    broadcastCardUpdated,
    broadcastCardMoved,
    broadcastCardReordered,
    broadcastCardDuplicated,
    broadcastCardDeleted,
    broadcastCardArchived,
    broadcastCardRestored,

    broadcastListCreated,
    broadcastListUpdated,
    broadcastListMoved,
    broadcastListDuplicated,
    broadcastListDeleted,
    broadcastListArchived,
    broadcastListRestored,

    broadcastLabelAdded,
    broadcastLabelRemoved,
    broadcastLabelCreated,
    broadcastLabelUpdated,
    broadcastLabelDeleted,

    broadcastMemberAssigned,
    broadcastMemberUnassigned,
    broadcastBoardMemberAdded,
    broadcastBoardMemberRemoved,
    broadcastBoardMemberRoleChanged,

    broadcastCommentAdded,
    broadcastCommentUpdated,
    broadcastCommentDeleted,

    broadcastChecklistCreated,
    broadcastChecklistItemToggled,
    broadcastChecklistDeleted,

    broadcastAttachmentCreated,
    broadcastAttachmentDeleted,

    broadcastBoardUpdated,

    broadcastCommentReactionRemoved,
    broadcastCommentReactionAdded,
    broadcastChecklistItemCreated,
    broadcastChecklistItemDeleted,

    otherUsers,
    isDraggingCardByOthers,
    isDraggingListByOthers,
    isEditingByOthers,
    getUserDraggingCard,
    getUserDraggingList,
    getUserEditingCard,
    canDragCard,
    canDragList,

    getCardOptimisticValue,
    getListOptimisticValue,
    getLabelOptimisticValue,
    getBoardOptimisticValue,
  };
};
