"use client";

import { CardItem } from "./card-item";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { ActionsMenu } from "../common/actions-menu";
import { useList } from "@/hooks/use-list";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CreateCard } from "./create-card";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface BoardListColumnProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
  isOverlay?: boolean;
}

export const BoardListColumn = ({ list, isOverlay }: BoardListColumnProps) => {
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
    opacity: isDragging ? 0.5 : 1,
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
    return null;
  }

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        "w-72 shrink-0 flex flex-col glass-card transition-all duration-200",
        isDragging && "opacity-40 cursor-grabbing",
        isOver && "ring-2 ring-primary/50 shadow-glow"
      )}
    >
      <div className="p-3 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent/10 rounded transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>

          <h3 className="font-semibold text-sm flex items-center gap-2 truncate">
            <span className="truncate">{list.name}</span>
            <span className="text-xs text-muted-foreground font-normal shrink-0 px-1.5 py-0.5 rounded-full bg-muted/50">
              {list.cards.length}
            </span>
          </h3>
        </div>

        <ActionsMenu onDelete={handleDeleteList} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="space-y-2 p-2 min-h-[100px]">
          <SortableContext
            items={list.cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </SortableContext>

          {list.cards.length === 0 && (
            <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border-2 border-dashed border-border/50 rounded-lg">
              Drop cards here
            </div>
          )}
        </div>
      </div>

      <div className="p-2 border-t border-border/30">
        <CreateCard list={list} />
      </div>
    </div>
  );
};
