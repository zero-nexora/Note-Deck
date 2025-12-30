"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { BoardHeaderNameDescription } from "./board-header-name-description";
import { BoardHeaderLabels } from "./board-header-labels";
import { BoardHeaderMembers } from "./board-header-members";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { BoardInviteMember } from "./board-invite-member";

interface BoardHeaderProps {
  board: BoardWithListColumnLabelAndMember;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const BoardHeader = ({ board, workspaceMembers }: BoardHeaderProps) => {
  return (
    <div className="border-b border-border/30 py-3">
      <div className="flex items-start justify-between gap-4">
        <BoardHeaderNameDescription boardId={board.id} boardName={board.name} boardDescription={board.description} />

        <div className="flex flex-col gap-4 flex-wrap items-end">
          <div className="flex gap-5">
            <BoardInviteMember
              boardId={board.id}
              boardMembers={board.members}
              workspaceMembers={workspaceMembers}
            />
            <BoardHeaderMembers boardMembers={board.members} boardId={board.id} />
          </div>
          <BoardHeaderLabels boardId={board.id} boardLabels={board.labels} />
        </div>
      </div>
    </div>
  );
};
