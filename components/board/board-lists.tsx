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
  return (
    <div className="flex gap-4 overflow-x-auto h-full items-start">
      <SortableContext
        items={board.lists.map((l) => l.id)}
        strategy={horizontalListSortingStrategy}
      >
        {board.lists.map((list) => <BoardListItem key={list.id} list={list} />)}
      </SortableContext>

      <CreateList board={board} />
    </div>
  );
};
