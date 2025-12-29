"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface BoardCardLabelsProps {
  cardLabels: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["cardLabels"];
}

export const BoardCardLabels = ({ cardLabels }: BoardCardLabelsProps) => {
  if (!cardLabels || cardLabels.length === 0) return null;

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="flex flex-wrap gap-1">
      {cardLabels.slice(0, 4).map((cardLabel) => (
        <div
          key={cardLabel.id}
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: hexToRgba(cardLabel.label.color, 0.2),
            color: cardLabel.label.color,
            border: `1px solid ${hexToRgba(cardLabel.label.color, 0.4)}`,
          }}
        >
          {cardLabel.label.name}
        </div>
      ))}
      {cardLabels.length > 4 && (
        <div className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
          +{cardLabels.length - 4}
        </div>
      )}
    </div>
  );
};
