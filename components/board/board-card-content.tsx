"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { cn } from "@/lib/utils";
import { BoardCardLabels } from "./board-card-labels";
import { BoardCardTitle } from "./board-card-title";
import { BoardCardMembers } from "./board-card-members";
import { BoardCardBadges } from "./board-card-badges";

interface BoardCardContentProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
  hasCover: boolean;
}

export const BoardCardContent = ({ card, hasCover }: BoardCardContentProps) => {
  const hasLabels = card.cardLabels && card.cardLabels.length > 0;
  const hasMembers = card.members && card.members.length > 0;

  return (
    <div className={cn("p-2.5 space-y-2", hasCover && "pt-2.5")}>
      {hasLabels && <BoardCardLabels cardLabels={card.cardLabels} />}

      <BoardCardTitle title={card.title} />

      <BoardCardBadges card={card} />

      {hasMembers && <BoardCardMembers members={card.members} />}
    </div>
  );
};
