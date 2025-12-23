import { Presence, RoomEvent, UserMeta } from "./lib/liveblocks";

declare global {
  interface Liveblocks {
    presence: Presence;

    storage: Storage;

    user: UserMeta;

    event: RoomEvent;
  }
}

export {};
