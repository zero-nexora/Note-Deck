"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { BoardHeaderNameDescription } from "./board-header-name-description";
import { BoardHeaderLabels } from "./board-header-labels";
import { BoardHeaderMembers } from "./board-header-members";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { useBoardMember } from "@/hooks/use-board-member";

interface BoardHeaderProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardHeader = ({ board }: BoardHeaderProps) => {
  const { inviteMember } = useBoardMember();

  const handleInvite = async () => {
    await inviteMember({
      boardId: board.id,
      userId: "f0f0a2d2-d7ab-4141-b7ee-3025252dc31d",
      role: "observer",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInvite();
    }
  };

  return (
    <div className="border-b border-border/30">
      <div className="flex items-start justify-between gap-4">
        <BoardHeaderNameDescription board={board} />

        <div className="flex flex-col gap-4 flex-wrap items-end">
          <div className="flex gap-5">
            <Button
              className="btn-gradient shrink-0"
              onClick={handleInvite}
              onKeyDown={handleKeyDown}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
            <BoardHeaderMembers board={board} />
          </div>
          <BoardHeaderLabels board={board} />
        </div>
      </div>
    </div>
  );
};
