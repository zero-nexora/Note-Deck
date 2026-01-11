"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardListItem } from "./board-list-item";
import { CreateList } from "./create-list";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardListsProps {
  board: BoardWithListLabelsAndMembers;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardLists = ({ board, realtimeUtils }: BoardListsProps) => {
  const sortedLists = [...board.lists].sort((a, b) => a.position - b.position);

  return (
    <div className="flex gap-4 h-full">
      <SortableContext
        items={sortedLists.map((l) => l.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-4">
          {sortedLists.map((list) => (
            <BoardListItem
              key={list.id}
              boardMembers={board.members}
              boardLabels={board.labels}
              list={list}
              realtimeUtils={realtimeUtils}
            />
          ))}
        </div>
      </SortableContext>

      <CreateList board={board} />
    </div>
  );
};
