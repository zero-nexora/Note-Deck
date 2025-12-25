"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BoardListItem } from "./board-list-item";
import { CreateList } from "./create-list";
import { UniqueIdentifier } from "@dnd-kit/core";

interface BoardListsProps {
  board: BoardWithListColumnLabelAndMember;
  activeId: string | null;
  overId: UniqueIdentifier | null;
}

export const BoardLists = ({ board, activeId, overId }: BoardListsProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto h-full items-start">
      <SortableContext
        items={board.lists.map((l) => l.id)}
        strategy={horizontalListSortingStrategy}
      >
        {board.lists.map((list) => {
          const isActive = activeId === list.id;
          const isOverList = overId === list.id;

          return (
            <div key={list.id} className="relative">
              <BoardListItem list={list} isActive={isActive} />

              {isOverList && activeId && activeId !== list.id && (
                <div className="absolute inset-0 ring-2 ring-primary/50 rounded-2xl pointer-events-none animate-pulse" />
              )}
            </div>
          );
        })}
      </SortableContext>

      <CreateList board={board} />
    </div>
  );
};
