"use client";
import Link from "next/link";
import { Zap } from "lucide-react";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { BoardHeaderNameDescription } from "./board-header-name-description";
import { BoardHeaderLabels } from "./board-header-labels";
import { BoardHeaderMembers } from "./board-header-members";
import { BoardInviteMember } from "./board-invite-member";
import { Button } from "../ui/button";

interface BoardHeaderProps {
  board: BoardWithListColumnLabelAndMember;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const BoardHeader = ({ board, workspaceMembers }: BoardHeaderProps) => {
  return (
    <header className="shrink-0 border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <BoardHeaderNameDescription
            boardId={board.id}
            boardName={board.name}
            boardDescription={board.description}
          />
        </div>

        <div className="flex items-center gap-2">
          <BoardHeaderLabels boardId={board.id} boardLabels={board.labels} />

          <BoardHeaderMembers boardMembers={board.members} boardId={board.id} />

          <BoardInviteMember
            boardId={board.id}
            boardMembers={board.members}
            workspaceMembers={workspaceMembers}
          />

          <Link
            href={`/workspaces/${board.workspaceId}/boards/${board.id}/automations`}
          >
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-accent hover:text-accent-foreground gap-2"
            >
              <Zap className="h-4 w-4 text-primary" />
              <span>Automations</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
