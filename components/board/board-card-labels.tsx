"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface BoardCardLabelsProps {
  cardLabels: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["cardLabels"];
}

export const BoardCardLabels = ({ cardLabels }: BoardCardLabelsProps) => {
  if (!cardLabels || cardLabels.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {cardLabels.slice(0, 5).map((cardLabel) => (
        <div
          key={cardLabel.id}
          className="h-2 w-12 rounded-full"
          style={{
            backgroundColor: cardLabel.label.color,
          }}
          title={cardLabel.label.name}
        />
      ))}
      {cardLabels.length > 5 && (
        <div className="h-2 px-2 rounded-full bg-muted flex items-center justify-center">
          <span className="text-[10px] font-medium text-muted-foreground">
            +{cardLabels.length - 5}
          </span>
        </div>
      )}
    </div>
  );
};
