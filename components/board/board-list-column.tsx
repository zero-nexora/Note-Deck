"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useList } from "@/hooks/use-list";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CreateCard } from "./create-card";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { BoardListColumnHeader } from "./board-list-column-header";
import { BoardListColumnCards } from "./board-list-column-cards";

interface BoardListColumnProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
  isActive?: boolean;
}

export const BoardListColumn = ({
  list,
  isActive = false,
}: BoardListColumnProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
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

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
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

  const { deleteList } = useList();

  const handleDeleteList = async () => {
    await deleteList(list.id);
  };

  const setRefs = (element: HTMLDivElement | null) => {
    setSortableRef(element);
    setDroppableRef(element);
  };

  if (isActive) {
    return null;
  }

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        "w-72 shrink-0 flex flex-col glass-card transition-all duration-200",
        isDragging && "opacity-40",
        isOver && "ring-2 ring-primary/50 shadow-glow"
      )}
    >
      <BoardListColumnHeader
        list={list}
        dragHandleProps={{ attributes, listeners }}
        onDelete={handleDeleteList}
      />

      <BoardListColumnCards list={list} />

      <div className="p-2 border-t border-border/30">
        <CreateCard list={list} />
      </div>
    </div>
  );
};
