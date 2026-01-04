"use client";

import { useModal } from "@/stores/modal-store";
import { BoardHeaderNameDescriptionForm } from "./board-header-name-description-form";

interface BoardHeaderNameDescriptionProps {
  boardId: string;
  boardName: string;
  boardDescription: string | null;
}

export const BoardHeaderNameDescription = ({
  boardId,
  boardName,
  boardDescription,
}: BoardHeaderNameDescriptionProps) => {
  const { open } = useModal();

  const handleEdit = () => {
    open({
      title: "Edit Board",
      description: "Update board name and description",
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
    <button
      onClick={handleEdit}
      className="group flex flex-col items-start gap-1 text-left hover:opacity-80 transition-opacity"
    >
      <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
        {boardName}
      </h1>
      {boardDescription && (
        <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
          {boardDescription}
        </p>
      )}
    </button>
  );
};
