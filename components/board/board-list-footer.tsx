"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { CreateCard } from "./create-card";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardListFooterProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardListFooter = ({
  list,
  realtimeUtils,
}: BoardListFooterProps) => {
  return (
    <div className="p-2 border-t border-border">
      <CreateCard realtimeUtils={realtimeUtils} list={list} />
    </div>
  );
};
