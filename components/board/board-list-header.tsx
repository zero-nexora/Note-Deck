"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { ActionsMenu } from "../common/actions-menu";
import { GripVertical } from "lucide-react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface BoardListHeaderProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
  dragHandleProps: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
  onDelete: () => void;
}

export const BoardListHeader = ({
  list,
  dragHandleProps,
  onDelete,
}: BoardListHeaderProps) => {
  return (
    <div className="p-3 flex items-center justify-between border-b border-border/30 bg-background/30">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent/10 rounded transition-colors touch-none"
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
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

      <ActionsMenu onDelete={onDelete} />
    </div>
  );
};
