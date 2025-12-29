"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardListItem } from "./board-list-item";
import { CreateList } from "./create-list";

interface BoardListsProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardLists = ({ board }: BoardListsProps) => {
  const sortedLists = [...board.lists].sort((a, b) => a.position - b.position);

  return (
    <div className="flex gap-4 h-full pb-4">
      <SortableContext
        items={sortedLists.map((l) => l.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-4">
          {sortedLists.map((list) => (
          <BoardListItem key={list.id} boardMembers={board.members} boardLabels={board.labels} list={list} />
        ))}
        </div>
      </SortableContext>

      <CreateList board={board} />
    </div>
  );
};
