"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { ActionsMenu } from "../common/actions-menu";
import { GripVertical } from "lucide-react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Button } from "../ui/button";

interface BoardListHeaderProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  dragHandleProps: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
  onDelete: () => void;
  onDuplicate: () => void;
}

export const BoardListHeader = ({
  list,
  dragHandleProps,
  onDelete,
  onDuplicate,
}: BoardListHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2 p-3 border-b border-border">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground hover:bg-accent"
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>

        <h3 className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-semibold text-foreground truncate">
            {list.name}
          </span>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
            {list.cards.length}
          </span>
        </h3>
      </div>

      <ActionsMenu onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );
};
