"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { BoardContent } from "./board-content";
import { User } from "@/domain/types/user.type";
import { BoardHeader } from "./board-header";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { useRouter } from "next/navigation";
import { ClientSideSuspense } from "@liveblocks/react";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { LiveCursors } from "./live-cursors";
import { generateUserColor, RoomProvider } from "@/lib/liveblocks";
import { useCallback, useRef } from "react";
import { LimitCardsPerBoard } from "@/domain/types/card.type";

interface BoardContainerProps {
  board: BoardWithListLabelsAndMembers;
  user: User;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
  limitCardsPerBoard: LimitCardsPerBoard | null;
}

const BoardContainerInner = ({
  board,
  user,
  workspaceMembers,
  limitCardsPerBoard,
}: BoardContainerProps) => {
  const router = useRouter();

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const lastRefreshRef = useRef<number>(0);
  const REFRESH_DEBOUNCE = 300;

  const handleBoardUpdate = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshRef.current;

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    if (timeSinceLastRefresh < REFRESH_DEBOUNCE) {
      refreshTimeoutRef.current = setTimeout(() => {
        lastRefreshRef.current = Date.now();
        router.refresh();
      }, REFRESH_DEBOUNCE);
    } else {
      lastRefreshRef.current = now;
      router.refresh();
    }
  }, [router]);

  const realtimeUtils = useBoardRealtime({
    board,
    user,
    onBoardUpdate: handleBoardUpdate,
  });

  return (
    <div className="relative h-screen bg-background">
      <LiveCursors />
      <div className="flex flex-col h-full gap-4">
        <BoardHeader
          limitCardsPerBoard={limitCardsPerBoard}
          board={board}
          workspaceMembers={workspaceMembers}
          realtimeUtils={realtimeUtils}
        />
        <BoardContent board={board} realtimeUtils={realtimeUtils} />
      </div>
    </div>
  );
};

export const BoardContainer = ({
  board,
  user,
  workspaceMembers,
  limitCardsPerBoard,
}: BoardContainerProps) => {
  const userColor = generateUserColor(user.id);

  return (
    <RoomProvider
      id={board.id}
      initialPresence={{
        cursor: null,
        draggingCardId: null,
        draggingListId: null,
        editingCardId: null,
        user: {
          id: user.id,
          name: user.name || "Anonymous",
          image: user.image,
          color: userColor,
        },
      }}
    >
      <ClientSideSuspense fallback={<BoardLoading />}>
        {() => (
          <BoardContainerInner
            limitCardsPerBoard={limitCardsPerBoard}
            board={board}
            user={user}
            workspaceMembers={workspaceMembers}
          />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

const BoardLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading board...</p>
      </div>
    </div>
  );
};
