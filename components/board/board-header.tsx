"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { BoardHeaderNameDescription } from "./board-header-name-description";
import { BoardHeaderLabels } from "./board-header-labels";
import { BoardHeaderMembers } from "./board-header-members";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { BoardInviteMember } from "./board-invite-member";
import Link from "next/link";
import { Button } from "../ui/button";
import { Zap } from "lucide-react";

interface BoardHeaderProps {
  board: BoardWithListColumnLabelAndMember;
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const BoardHeader = ({ board, workspaceMembers }: BoardHeaderProps) => {
  return (
    <div className="border-b border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <BoardHeaderNameDescription
            boardId={board.id}
            boardName={board.name}
            boardDescription={board.description}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <BoardHeaderLabels boardId={board.id} boardLabels={board.labels} />
          
          <div className="h-5 w-px bg-border" />
          
          <BoardHeaderMembers boardMembers={board.members} boardId={board.id} />
          
          <BoardInviteMember
            boardId={board.id}
            boardMembers={board.members}
            workspaceMembers={workspaceMembers}
          />
          
          <div className="h-5 w-px bg-border" />
          
          <Link
            href={`/workspaces/${board.workspaceId}/boards/${board.id}/automations`}
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-primary/20 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Automations</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};