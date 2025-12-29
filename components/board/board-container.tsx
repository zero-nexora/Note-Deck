"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { generateUserColor, RoomProvider } from "@/lib/liveblocks";
import { BoardContent } from "./board-content";
import { boardToStorage } from "@/lib/utils";
import { User } from "@/domain/types/user.type";
import { BoardHeader } from "./board-header";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";

interface BoardContainerProps {
  board: BoardWithListColumnLabelAndMember;
  user: User;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const BoardContainer = ({ board, user, workspaceMembers }: BoardContainerProps) => {
  return (
    // <RoomProvider
    //   id={board.id}
    //   initialPresence={{
    //     cursor: null,
    //     selectedCardId: null,
    //     editingCardId: null,
    //     editingField: null,
    //     dragState: {
    //       isDragging: false,
    //       dragType: null,
    //       draggingId: null,
    //       dragOffset: null,
    //       pointer: null,
    //       sourceListId: null,
    //       sourcePosition: null,
    //     },
    //     user: {
    //       id: user.id,
    //       name: user.name || "",
    //       image: user.image,
    //       color: generateUserColor(user.id),
    //     },
    //   }}
    //   initialStorage={{
    //     board: boardToStorage(board),
    //   }}
    // >
      <div className="flex flex-col gap-5">
        <BoardHeader board={board} workspaceMembers={workspaceMembers} />
        <BoardContent board={board} />
      </div>
    // </RoomProvider>
  );
};
