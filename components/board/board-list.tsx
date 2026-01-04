"use client";
import { BoardWithMember } from "@/domain/types/board.type";
import { BoardCard } from "./board-card";
import { CreateBoard } from "./create-board";

interface BoardListProps {
  workspaceId: string;
  boards: BoardWithMember[];
}

export const BoardList = ({ boards, workspaceId }: BoardListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
      <CreateBoard workspaceId={workspaceId} />
    </div>
  );
};
