"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { CreateCard } from "./create-card";

interface BoardListFooterProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
}

export const BoardListFooter = ({ list }: BoardListFooterProps) => {
  return (
    <div className="p-2 border-t border-border/30">
      <CreateCard list={list} />
    </div>
  );
};
