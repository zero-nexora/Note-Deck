import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export const liveblocksClient = createClient({
  authEndpoint: "/api/liveblocks-auth",
  throttle: 16,
});

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
    avatar: string | null;
    color: string;
  };
};

export type Storage = {
  cards: any;
  lists: any;
};

export type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar?: string;
    email: string;
  };
};

export type RoomEvent = {
  type: "CARD_MOVED" | "CARD_UPDATED" | "LIST_MOVED";
  data: any;
};

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
