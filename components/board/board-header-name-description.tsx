"use client";

import { useModal } from "@/stores/modal-store";
import { BoardHeaderNameDescriptionForm } from "./board-header-name-description-form";
import { Pencil } from "lucide-react";

interface BoardHeaderNameProps {
  boardId: string;
  boardName: string;
  boardDescription: string | null;
}

export const BoardHeaderNameDescription = ({
  boardId,
  boardDescription,
  boardName,
}: BoardHeaderNameProps) => {
  const { open } = useModal();

  const handleOpenEditNameDescriptionBoard = () => {
    open({
      title: "Edit board name and description",
      description: "",
      children: (
        <BoardHeaderNameDescriptionForm
          boardId={boardId}
          boardName={boardName}
          boardDescription={boardDescription}
        />
      ),
    });
  };

  return (
    <div className="space-y-2">
      <div
        className="group relative cursor-pointer rounded-md px-3 py-2 transition-colors flex gap-2"
        onClick={handleOpenEditNameDescriptionBoard}
        title="Click to edit"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
            {boardName}
          </h1>
          <p className="min-h-5 flex-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
            {boardDescription || "Add a description..."}
          </p>
        </div>
        <Pencil className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  );
};
