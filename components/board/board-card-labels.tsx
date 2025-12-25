"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface BoardCardLabelsProps {
  labels: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["labels"];
}

export const BoardCardLabels = ({ labels }: BoardCardLabelsProps) => {
  if (!labels || labels.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {labels.slice(0, 4).map((label) => (
        <div
          key={label.id}
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: `${label.label.color}20`,
            color: label.label.color,
            border: `1px solid ${label.label.color}40`,
          }}
        >
          {label.label.name}
        </div>
      ))}
      {labels.length > 4 && (
        <div className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
          +{labels.length - 4}
        </div>
      )}
    </div>
  );
};
