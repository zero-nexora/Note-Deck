"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { BoardContent } from "./board-content";
import { User } from "@/domain/types/user.type";
import { BoardHeader } from "./board-header";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { useRouter } from "next/navigation";
import { ClientSideSuspense } from "@liveblocks/react";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { LiveCursors } from "./live-cursors";
import { generateUserColor, RoomProvider } from "@/lib/liveblocks";

interface BoardContainerProps {
  board: BoardWithListColumnLabelAndMember;
  user: User;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

const BoardContainerInner = ({
  board,
  user,
  workspaceMembers,
}: BoardContainerProps) => {
  const router = useRouter();
  const realtimeUtils = useBoardRealtime({
    board,
    user,
    onBoardUpdate: () => {
      router.refresh();
    },
  });

  return (
    <div className="relative h-screen bg-background">
      <LiveCursors />
      <div className="flex flex-col h-full gap-4">
        <BoardHeader board={board} workspaceMembers={workspaceMembers} />
        <BoardContent board={board} realtimeUtils={realtimeUtils} />
      </div>
    </div>
  );
};

export const BoardContainer = ({
  board,
  user,
  workspaceMembers,
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
