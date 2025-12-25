"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useList } from "@/hooks/use-list";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { BoardListCards } from "./board-list-cards";
import { BoardListHeader } from "./board-list-header";
import { BoardListFooter } from "./board-list-footer";
import { ScrollArea } from "../ui/scroll-area";

interface BoardListItemProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
  isActive?: boolean;
  isOverlay?: boolean;
}

export const BoardListItem = ({
  list,
  isActive = false,
  isOverlay = false,
}: BoardListItemProps) => {
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
    disabled: isOverlay,
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

  if (isOverlay) {
    return (
      <div className="w-72 h-[400px] shrink-0 bg-card/40 rounded-2xl border-2 border-primary/50 backdrop-blur-sm pointer-events-none" />
    );
  }

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
      <BoardListHeader
        list={list}
        dragHandleProps={{ attributes, listeners }}
        onDelete={handleDeleteList}
      />

      <ScrollArea className="h-[calc(100vh-270px)]">
        <BoardListCards list={list} />
      </ScrollArea>

      <BoardListFooter list={list} />
    </div>
  );
};
