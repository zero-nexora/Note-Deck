"use client";

import { CardItem } from "./card-item";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { ActionsMenu } from "../common/actions-menu";
import { useList } from "@/hooks/use-list";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CreateCard } from "./create-card";

interface BoardListColumnProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
}

export const BoardListColumn = ({ list }: BoardListColumnProps) => {
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
    opacity: isDragging ? 0.5 : 1,
  };

  const { deleteList } = useList();

  const handleDeleteList = async () => {
    await deleteList(list.id);
  };

  return (
    <div
      className="w-72 shrink-0 flex flex-col bg-secondary/50 rounded-xl border border-border/50 h-fit"
    >
      {/* Header */}
      <div
        className="p-3 flex items-center justify-between"
      >
        <h3 className="font-semibold text-sm flex items-center gap-2">
          {list.name}
          <span className="text-xs text-muted-foreground font-normal">
            {list.cards.length}
          </span>
        </h3>

        <ActionsMenu onDelete={handleDeleteList} />
      </div>

      <div className="space-y-2 pb-2 p-2">
        {list.cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      <CreateCard list={list} />
    </div>
  );
};
