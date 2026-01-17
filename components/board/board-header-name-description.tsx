"use client";

import { useModal } from "@/stores/modal-store";
import { BoardHeaderNameDescriptionForm } from "./board-header-name-description-form";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { useMemo } from "react";

interface BoardHeaderNameDescriptionProps {
  boardId: string;
  boardName: string;
  boardDescription: string | null;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardHeaderNameDescription = ({
  boardId,
  boardName,
  boardDescription,
  realtimeUtils,
}: BoardHeaderNameDescriptionProps) => {
  const { open } = useModal();

  const displayName = useMemo(() => {
    return (
      realtimeUtils?.getBoardOptimisticValue("title") ??
      realtimeUtils?.getBoardOptimisticValue("name") ??
      boardName
    );
  }, [boardName, realtimeUtils]);

  const displayDescription = useMemo(() => {
    return (
      realtimeUtils?.getBoardOptimisticValue("description") ?? boardDescription
    );
  }, [boardDescription, realtimeUtils]);

  const handleEdit = () => {
    open({
      title: "Edit Board",
      description: "Update board name and description",
      children: (
        <BoardHeaderNameDescriptionForm
          boardId={boardId}
          boardName={displayName}
          boardDescription={displayDescription}
          realtimeUtils={realtimeUtils}
        />
      ),
    });
  };

  return (
    <button
      onDoubleClick={handleEdit}
      className="group flex flex-col items-start gap-1 text-left hover:opacity-80 transition-opacity"
    >
      <h1 className="font-bold text-foreground group-hover:text-primary transition-colors">
        {displayName}
      </h1>
      {displayDescription && (
        <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
          {displayDescription}
        </p>
      )}
    </button>
  );
};
