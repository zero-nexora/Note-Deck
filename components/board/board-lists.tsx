"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardListItem } from "./board-list-item";
import { CreateList } from "./create-list";
import { User } from "@/domain/types/user.type";
import { useMemo } from "react";
import { useBoardRealtimeLists } from "@/hooks/use-board-realtime-lists";

interface BoardListsProps {
  board: BoardWithListLabelsAndMembers;
  user: User;
}

export const BoardLists = ({ board, user }: BoardListsProps) => {
  const { isListDeleted } = useBoardRealtimeLists({ user });

  const visibleLists = useMemo(() => {
    return board.lists.filter((list) => !isListDeleted(list.id));
  }, [board.lists, isListDeleted]);

  const sortedLists = useMemo(() => {
    return [...visibleLists].sort((a, b) => a.position - b.position);
  }, [visibleLists]);

  return (
    <div className="flex gap-4 h-full p-4">
      <SortableContext
        items={sortedLists.map((l) => l.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-4 items-start">
          {sortedLists.map((list) => (
            <BoardListItem
              key={list.id}
              boardMembers={board.members}
              boardLabels={board.labels}
              list={list}
              user={user}
            />
          ))}
        </div>
      </SortableContext>

      <CreateList board={board} user={user} />
    </div>
  );
};
