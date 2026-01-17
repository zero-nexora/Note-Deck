"use client";

import { createClient } from "@liveblocks/client";
import { OpaqueClient } from "@liveblocks/core";
import { createRoomContext } from "@liveblocks/react";

export type Presence = {
  cursor: {
    x: number;
    y: number;
  } | null;
  draggingCardId: string | null;
  draggingListId: string | null;
  editingCardId: string | null;
  user: {
    id: string;
    name: string;
    image: string | null;
    color: string;
  };
};

export type Storage = {};

export type UserMeta = {
  id: string;
  info: {
    name: string;
    image: string | null;
    color: string;
  };
};

export type RoomEvent =
  | {
      type: "CARD_CREATED";
      cardId: string;
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_DUPLICATED";
      sourceCardId: string;
      newCardId: string;
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_DELETED";
      cardId: string;
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_ARCHIVED";
      cardId: string;
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_RESTORED";
      cardId: string;
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_MOVED";
      cardId: string;
      sourceListId: string;
      destinationListId: string;
      sourcePosition: number;
      destinationPosition: number;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_UPDATED";
      cardId: string;
      listId: string;
      field: "title" | "description" | "dueDate" | "coverImage";
      value: any;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_REORDERED";
      listId: string;
      cardId: string;
      oldPosition: number;
      newPosition: number;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_CREATED";
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_DUPLICATED";
      sourceListId: string;
      newListId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_DELETED";
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_ARCHIVED";
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_RESTORED";
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_UPDATED";
      listId: string;
      field: "title";
      value: any;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_MOVED";
      listId: string;
      oldPosition: number;
      newPosition: number;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_REORDERED";
      listId: string;
      oldPosition: number;
      newPosition: number;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LABEL_ADDED";
      cardId: string;
      labelId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LABEL_REMOVED";
      cardId: string;
      labelId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LABEL_CREATED";
      labelId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LABEL_UPDATED";
      labelId: string;
      field: "name" | "color";
      value: any;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LABEL_DELETED";
      labelId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "MEMBER_ASSIGNED";
      cardId: string;
      memberId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "MEMBER_UNASSIGNED";
      cardId: string;
      memberId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "BOARD_MEMBER_ADDED";
      memberId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "BOARD_MEMBER_REMOVED";
      memberId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "BOARD_MEMBER_ROLE_CHANGED";
      memberId: string;
      role: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "COMMENT_ADDED";
      cardId: string;
      commentId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "COMMENT_UPDATED";
      cardId: string;
      commentId: string;
      content: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "COMMENT_DELETED";
      cardId: string;
      commentId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "COMMENT_REACTION_ADDED";
      commentId: string;
      reaction: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "COMMENT_REACTION_REMOVED";
      commentId: string;
      reaction: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_CREATED";
      cardId: string;
      checklistId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_UPDATED";
      checklistId: string;
      field: "title";
      value: any;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_DELETED";
      checklistId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_REORDERED";
      checklistId: string;
      oldPosition: number;
      newPosition: number;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_ITEM_CREATED";
      checklistId: string;
      itemId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_ITEM_TOGGLED";
      itemId: string;
      checked: boolean;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_ITEM_UPDATED";
      itemId: string;
      content: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_ITEM_DELETED";
      itemId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CHECKLIST_ITEM_REORDERED";
      itemId: string;
      oldPosition: number;
      newPosition: number;
      userId: string;
      timestamp: number;
    }
  | {
      type: "ATTACHMENT_CREATED";
      cardId: string;
      attachmentId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "ATTACHMENT_DELETED";
      attachmentId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "BOARD_UPDATED";
      field: "title" | "description" | "background";
      value: any;
      userId: string;
      timestamp: number;
    }
  | {
      type: "BOARD_ARCHIVED";
      userId: string;
      timestamp: number;
    }
  | {
      type: "BOARD_RESTORED";
      userId: string;
      timestamp: number;
    };

export const liveblocksClient = createClient({
  authEndpoint: "/api/liveblocks-auth",
  throttle: 16,
}) as OpaqueClient;

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useSelf,
  useStorage,
  useMutation,
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useBroadcastEvent,
  useEventListener,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(liveblocksClient);

export const generateUserColor = (userId: string): string => {
  const hash = userId.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
};

export const needsRefresh = (eventType: RoomEvent["type"]): boolean => {
  const refreshEvents = new Set([
    "CARD_CREATED",
    "CARD_DUPLICATED",
    "CARD_DELETED",
    "CARD_ARCHIVED",
    "CARD_RESTORED",

    "LIST_CREATED",
    "LIST_DUPLICATED",
    "LIST_DELETED",
    "LIST_ARCHIVED",
    "LIST_RESTORED",

    "LABEL_CREATED",
    "LABEL_DELETED",

    "COMMENT_ADDED",
    "COMMENT_UPDATED",
    "COMMENT_DELETED",

    "CHECKLIST_CREATED",
    "CHECKLIST_DELETED",
    "CHECKLIST_ITEM_CREATED",
    "CHECKLIST_ITEM_DELETED",

    "ATTACHMENT_CREATED",
    "ATTACHMENT_DELETED",

    "BOARD_MEMBER_ADDED",
    "BOARD_MEMBER_REMOVED",

    "BOARD_ARCHIVED",
    "BOARD_RESTORED",
  ]);

  return refreshEvents.has(eventType);
};
