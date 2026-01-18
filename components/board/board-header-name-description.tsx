"use client";

import { useModal } from "@/stores/modal-store";
import { BoardHeaderNameDescriptionForm } from "./board-header-name-description-form";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { useMemo } from "react";
import { LimitCardsPerBoard } from "@/domain/types/card.type";
import { Badge } from "../ui/badge";
import { FileText } from "lucide-react";

interface BoardHeaderNameDescriptionProps {
  boardId: string;
  boardName: string;
  boardDescription: string | null;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
  limitCardsPerBoard: LimitCardsPerBoard | null;
}

export const BoardHeaderNameDescription = ({
  boardId,
  boardName,
  boardDescription,
  realtimeUtils,
  limitCardsPerBoard,
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

  const getLimitBadgeVariant = () => {
    if (!limitCardsPerBoard) return "secondary";

    const { usage, limits } = limitCardsPerBoard;

    if (limits.cards === -1) return "secondary";

    const percentage = (usage.cards / limits.cards) * 100;

    if (percentage >= 90) return "destructive";
    if (percentage >= 75) return "outline";

    return "secondary";
  };

  return (
    <div className="flex items-center gap-3">
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

      {limitCardsPerBoard && (
        <Badge variant={getLimitBadgeVariant()} className="gap-1.5 shrink-0">
          <FileText className="h-3 w-3" />
          {limitCardsPerBoard.limits.cards === -1
            ? "Unlimited Cards"
            : `${limitCardsPerBoard.usage.cards}/${limitCardsPerBoard.limits.cards}`}
        </Badge>
      )}
    </div>
  );
};
