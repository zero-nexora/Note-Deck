"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { CreateCard } from "./create-card";
import { User } from "@/domain/types/user.type";

interface BoardListFooterProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  user: User;
}

export const BoardListFooter = ({ list, user }: BoardListFooterProps) => {
  return (
    <div className="p-2 border-t border-border">
      <CreateCard list={list} user={user} />
    </div>
  );
};
