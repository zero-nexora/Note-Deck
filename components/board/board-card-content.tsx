"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { cn } from "@/lib/utils";
import { BoardCardLabels } from "./board-card-labels";
import { BoardCardTitle } from "./board-card-title";
import { BoardCardMembers } from "./board-card-members";
import { BoardCardMeta } from "./board-card-meta";

interface BoardCardContentProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
  hasCover: boolean;
}

export const BoardCardContent = ({ card, hasCover }: BoardCardContentProps) => {
  const hasLabels = card.labels && card.labels.length > 0;
  const hasMembers = card.members && card.members.length > 0;
  const hasDescription = !!card.description;
  const hasDueDate = !!card.dueDate;

  return (
    <div className={cn("p-3 space-y-2", hasCover && "pt-2")}>
      {hasLabels && <BoardCardLabels labels={card.labels} />}

      <BoardCardTitle title={card.title} />

      {(hasDueDate || hasDescription) && (
        <BoardCardMeta dueDate={card.dueDate} hasDescription={hasDescription} />
      )}

      {hasMembers && <BoardCardMembers members={card.members} />}
    </div>
  );
};
