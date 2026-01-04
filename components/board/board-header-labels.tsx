"use client";

import { useModal } from "@/stores/modal-store";
import { BoardHeaderLabelsDetail } from "./board-header-labels-detail";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Tag } from "lucide-react";
import { Button } from "../ui/button";

interface BoardHeaderLabelsProps {
  boardId: string;
  boardLabels: BoardWithListColumnLabelAndMember["labels"];
}

export const BoardHeaderLabels = ({
  boardLabels,
  boardId,
}: BoardHeaderLabelsProps) => {
  const { open } = useModal();

  const handleViewDetailLabels = () => {
    open({
      title: "Labels",
      description: "Manage board labels and colors",
      children: (
        <BoardHeaderLabelsDetail boardId={boardId} boardLabels={boardLabels} />
      ),
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleViewDetailLabels}
      className="border-border hover:bg-accent hover:text-accent-foreground"
    >
      <Tag className="h-4 w-4" />
    </Button>
  );
};
