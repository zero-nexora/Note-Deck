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
      type: "CARD_MOVED";
      cardId: string;
      sourceListId: string;
      destinationListId: string;
      position: number;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_UPDATED";
      cardId: string;
      field: "title" | "description" | "dueDate" | "coverImage";
      value: any;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_CREATED";
      cardId: string;
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
      type: "LIST_CREATED";
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_UPDATED";
      listId: string;
      field: string;
      value: any;
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
      type: "LIST_MOVED";
      listId: string;
      position: number;
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
      type: "COMMENT_ADDED";
      cardId: string;
      commentId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "BOARD_UPDATED";
      field: string;
      value: any;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_DUPLICATED";
      sourceCardId: string;
      newCardId?: string;
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_DUPLICATED";
      sourceListId: string;
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
