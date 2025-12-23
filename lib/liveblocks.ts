"use client";

import { createClient } from "@liveblocks/client";
import { OpaqueClient } from "@liveblocks/core";
import { createRoomContext } from "@liveblocks/react";

export type DragState = {
  isDragging: boolean;
  dragType: "card" | "list" | null;
  draggingId: string | null;
  dragOffset: { x: number; y: number } | null;
  pointer: { x: number; y: number } | null;
  sourceListId?: string | null;
  sourcePosition?: number | null;
};

export type Presence = {
  cursor: { x: number; y: number } | null;
  selectedCardId: string | null;
  editingCardId: string | null;
  editingField: string | null;
  dragState: DragState;
  user: {
    id: string;
    name: string;
    image: string | null;
    color: string;
  };
};

type Storage = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lists: {
    id: string;
    name: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    boardId: string;
    position: number;
    cards: {
      id: string;
      description: string | null;
      isArchived: boolean;
      createdAt: string;
      updatedAt: string;
      boardId: string;
      position: number;
      listId: string;
      title: string;
      dueDate: string | null;
      coverImage: string | null;
      labels: {
        id: string;
        cardId: string;
        labelId: string;
        label: {
          id: string;
          name: string;
          createdAt: string;
          boardId: string;
          color: string;
        };
      }[];
      members: {
        id: string;
        cardId: string;
        userId: string;
        name: string;
        image: string | null;
      }[];
    }[];
  }[];
  labels: {
    id: string;
    boardId: string;
    name: string;
    color: string;
  }[];
  members: {
    id: string;
    boardId: string;
    userId: string;
    name: string;
    image: string | null;
  }[];
  workspace: {
    id: string;
    name: string;
  };
};

export type UserMeta = {
  id: string;
  info: {
    name: string;
    image?: string;
    email: string;
  };
};

export type RoomEvent = {
  type: "CARD_MOVED" | "CARD_UPDATED" | "LIST_MOVED";
  data: any;
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
