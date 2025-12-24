"use client";

import { createClient } from "@liveblocks/client";
import { LiveObject, OpaqueClient, LiveList } from "@liveblocks/core";
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

export type Storage = {
  board: LiveObject<{
    id: string;
    workspaceId: string;
    name: string;
    description: string | null;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;

    lists: LiveList<
      LiveObject<{
        id: string;
        boardId: string;
        name: string;
        position: number;
        isArchived: boolean;
        createdAt: string;
        updatedAt: string;

        cards: LiveList<
          LiveObject<{
            id: string;
            boardId: string;
            listId: string;
            title: string;
            description: string | null;
            position: number;
            dueDate: string | null;
            coverImage: string | null;
            isArchived: boolean;
            createdAt: string;
            updatedAt: string;

            labels: LiveList<
              LiveObject<{
                id: string;
                cardId: string;
                labelId: string;
                label: {
                  id: string;
                  boardId: string;
                  name: string;
                  color: string;
                  createdAt: string;
                };
              }>
            >;

            members: LiveList<
              LiveObject<{
                id: string;
                cardId: string;
                userId: string;
                createdAt: string;
                user: {
                  id: string;
                  name: string | null;
                  email: string | null;
                  emailVerified: string | null;
                  image: string | null;
                  password: string | null;
                };
              }>
            >;
          }>
        >;
      }>
    >;

    labels: LiveList<
      LiveObject<{
        id: string;
        boardId: string;
        name: string;
        color: string;
        createdAt: string;
      }>
    >;

    members: LiveList<
      LiveObject<{
        id: string;
        boardId: string;
        userId: string;
        role: string;
        createdAt: string;
        user: {
          id: string;
          name: string | null;
          email: string | null;
          emailVerified: string | null;
          image: string | null;
          password: string | null;
        };
      }>
    >;

    workspace: {
      id: string;
      name: string;
      slug: string;
      ownerId: string;
      plan: string;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
      subscriptionStatus: string | null;
      limits: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }>;
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
