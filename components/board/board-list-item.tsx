"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useList } from "@/hooks/use-list";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardListCards } from "./board-list-cards";
import { BoardListHeader } from "./board-list-header";
import { BoardListFooter } from "./board-list-footer";
import { ScrollArea } from "../ui/scroll-area";
import { useConfirm } from "@/stores/confirm-store";

interface BoardListItemProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  boardLabels: BoardWithListColumnLabelAndMember["labels"];
}

export const BoardListItem = ({ list, boardLabels = [], boardMembers = [] }: BoardListItemProps) => {
  const { open } = useConfirm();
  const { deleteList } = useList();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteList = async () => {
    open({
      title: "Delete list",
      description: "Are you sure you want to delete this list?",
      onConfirm: async () => {
        await deleteList({ id: list.id });
      },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-72 shrink-0 flex flex-col glass-card",
        isDragging && "opacity-50"
      )}
    >
      <BoardListHeader
        list={list}
        dragHandleProps={{ attributes, listeners }}
        onDelete={handleDeleteList}
      />

      <ScrollArea className="h-[calc(100vh-270px)]">
        <BoardListCards boardMembers={boardMembers} boardLabels={boardLabels} list={list} />
      </ScrollArea>

      <BoardListFooter list={list} />
    </div>
  );
};
