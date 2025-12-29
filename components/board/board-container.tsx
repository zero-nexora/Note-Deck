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
      console.log("Board update triggered - refreshing...");
      router.refresh();
    },
  });

  return (
    <div className="relative h-full">
      <LiveCursors />
      <div className="flex flex-col gap-5">
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
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};
