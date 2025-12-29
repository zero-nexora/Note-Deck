"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { useModal } from "@/stores/modal-store";
import { BoardHeaderLabelsDetail } from "./board-header-labels-detail";

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
      description: "",
      children: (
        <BoardHeaderLabelsDetail boardId={boardId} boardLabels={boardLabels} />
      ),
    });
  };

  return (
    <Button variant={"outline"} onClick={handleViewDetailLabels}>
      <Tag className="w-4 h-4 text-muted-foreground" />
    </Button>
  );
};
