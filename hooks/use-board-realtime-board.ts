import { User } from "@/domain/types/user.type";
import { useCallback, useState } from "react";
import { useBroadcastEvent, useEventListener } from "@/lib/liveblocks";

type BoardState = {
  name: string | undefined;
  description: string | undefined;
};

interface UseBoardRealtimeBoardProps {
  user: User;
}

export const useBoardRealtimeBoard = ({ user }: UseBoardRealtimeBoardProps) => {
  const broadcast = useBroadcastEvent();
  const [boardUpdates, setBoardUpdates] = useState<BoardState>({
    name: undefined,
    description: undefined,
  });

  const broadcastBoardUpdated = useCallback(
    (data: { updates: BoardState }) => {
      broadcast({
        type: "BOARD_UPDATED",
        updates: data.updates,
        userId: user.id,
        timestamp: Date.now(),
      });
    },
    [broadcast, user.id],
  );

  useEventListener(({ event }) => {
    if (event.userId === user.id) return;

    if (event.type === "BOARD_UPDATED") {
      setBoardUpdates((prev) => ({ ...prev, ...event.updates }));
    }
  });

  const getBoardValue = (field: keyof BoardState) => boardUpdates[field];

  return {
    broadcastBoardUpdated,
    getBoardValue,
  };
};
