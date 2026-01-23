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
      type: "BOARD_UPDATED";
      updates: { name: string | undefined; description: string | undefined };
      userId: string;
      timestamp: number;
    }
  | { type: "BOARD_ARCHIVED"; userId: string; timestamp: number }
  | { type: "BOARD_RESTORED"; userId: string; timestamp: number }
  | { type: "BOARD_DELETED"; userId: string; timestamp: number }
  | { type: "BOARD_MEMBER_ADDED"; userId: string; timestamp: number }
  | { type: "BOARD_MEMBER_REMOVED"; userId: string; timestamp: number }
  | { type: "BOARD_MEMBER_ROLE_CHANGED"; userId: string; timestamp: number }
  | { type: "LABEL_CREATED"; userId: string; timestamp: number }
  | { type: "LABEL_UPDATED"; userId: string; timestamp: number }
  | { type: "LABEL_DELETED"; userId: string; timestamp: number }
  | {
      type: "LIST_CREATED";
      list: {
        id: string;
        boardId: string;
        name: string;
        position: number;
        isArchived: boolean;
        createdAt: any;
        updatedAt: any;
        cards: any;
      };
      userId: string;
      timestamp: number;
    }
  | {
      type: "LIST_UPDATED";
      listId: string;
      updates: { name?: string };
      userId: string;
      timestamp: number;
    }
  | { type: "LIST_REORDERED"; userId: string; timestamp: number }
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
  | { type: "LIST_DELETED"; listId: string; userId: string; timestamp: number }
  | {
      type: "LIST_DUPLICATED";
      list: {
        id: string;
        boardId: string;
        name: string;
        position: number;
        isArchived: boolean;
        createdAt: any;
        updatedAt: any;
        cards: any;
      };
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_CREATED";
      card: {
        id: string;
        listId: string;
        boardId: string;
        title: string;
        description: string | null;
        position: number;
        dueDate: any | null;
        coverImage: string | null;
        isArchived: boolean;
        createdAt: any;
        updatedAt: any;
        attachmentsCount: number;
        commentsCount: number;
        checklistsCount: number;
        cardLabels: {
          id: string;
          cardId: string;
          labelId: string;
          label: {
            id: string;
            boardId: string;
            name: string;
            color: string;
            createdAt: any;
          };
        }[];
        members: {
          id: string;
          cardId: string;
          userId: string;
          createdAt: any;
          user: {
            id: string;
            name: string | null;
            email: string | null;
            image: string | null;
          };
        }[];
      };
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_UPDATED";
      cardId: string;
      listId: string;
      updates: {
        title?: string;
        description?: string | null;
        dueDate?: any;
        coverImage?: string | null;
      };
      userId: string;
      timestamp: number;
    }
  | { type: "CARD_MOVED"; userId: string; timestamp: number }
  | { type: "CARD_REORDERED"; userId: string; timestamp: number }
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
      type: "CARD_DELETED";
      cardId: string;
      listId: string;
      userId: string;
      timestamp: number;
    }
  | {
      type: "CARD_DUPLICATED";
      card: {
        id: string;
        listId: string;
        boardId: string;
        title: string;
        description: string | null;
        position: number;
        dueDate: any;
        coverImage: string | null;
        isArchived: boolean;
        createdAt: any;
        updatedAt: any;
        attachmentsCount: number;
        commentsCount: number;
        checklistsCount: number;
        cardLabels: {
          id: string;
          cardId: string;
          labelId: string;
          label: {
            id: string;
            boardId: string;
            name: string;
            color: string;
            createdAt: any;
          };
        }[];
        members: {
          id: string;
          cardId: string;
          userId: string;
          createdAt: any;
          user: {
            id: string;
            name: string | null;
            email: string | null;
            image: string | null;
          };
        }[];
      };
      userId: string;
      timestamp: number;
    }
  | { type: "ATTACHMENT_CREATED"; userId: string; timestamp: number }
  | { type: "ATTACHMENT_DELETED"; userId: string; timestamp: number }
  | { type: "CARD_MEMBER_ASSIGNED"; userId: string; timestamp: number }
  | { type: "CARD_MEMBER_UNASSIGNED"; userId: string; timestamp: number }
  | { type: "CARD_LABEL_ADDED"; userId: string; timestamp: number }
  | { type: "CARD_LABEL_REMOVED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_CREATED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_UPDATED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_REORDERED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_DELETED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_ITEM_CREATED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_ITEM_TOGGLED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_ITEM_UPDATED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_ITEM_REORDERED"; userId: string; timestamp: number }
  | { type: "CHECKLIST_ITEM_DELETED"; userId: string; timestamp: number }
  | { type: "COMMENT_ADDED"; userId: string; timestamp: number }
  | { type: "COMMENT_UPDATED"; userId: string; timestamp: number }
  | { type: "COMMENT_DELETED"; userId: string; timestamp: number }
  | { type: "COMMENT_REACTION_ADDED"; userId: string; timestamp: number }
  | { type: "COMMENT_REACTION_REMOVED"; userId: string; timestamp: number };

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
