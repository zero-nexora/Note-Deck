import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag, Plus, X } from "lucide-react";
import { useCardLabel } from "@/hooks/use-card-label";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface BoardCardItemLabelsProps {
  cardId: string;
  cardLabels: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["cardLabels"];
  boardLabels: BoardWithListColumnLabelAndMember["labels"];
}

export const BoardCardItemLabels = ({
  cardId,
  cardLabels: initialCardLabels = [],
  boardLabels = [],
}: BoardCardItemLabelsProps) => {
  const [cardLabels, setCardLabels] = useState(initialCardLabels);
  const [isAdding, setIsAdding] = useState(false);
  const { addLabel, removeLabel } = useCardLabel();

  useEffect(() => {
    setCardLabels(initialCardLabels);
  }, [initialCardLabels]);

  const assignedLabelIds = new Set(cardLabels.map((cl) => cl.label.id));

  const handleToggleLabel = async (labelId: string) => {
    const isAssigned = assignedLabelIds.has(labelId);

    if (isAssigned) {
      await removeLabel({ cardId, labelId });
      setCardLabels((prev) => prev.filter((cl) => cl.label.id !== labelId));
    } else {
      const newCardLabel = await addLabel({ cardId, labelId });
      if (newCardLabel) {
        const boardLabel = boardLabels.find((l) => l.id === labelId);
        if (boardLabel) {
          setCardLabels((prev) => [
            ...prev,
            {
              id: newCardLabel.id,
              cardId: newCardLabel.cardId,
              labelId: newCardLabel.labelId,
              label: {
                name: boardLabel.name,
                id: boardLabel.id,
                createdAt: boardLabel.createdAt,
                boardId: boardLabel.boardId,
                color: boardLabel.color,
              },
            },
          ]);
        }
      }
      setIsAdding(false);
    }
  };

  return (
    <Card className="p-5 bg-card border-border/60">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Labels</h3>
            {cardLabels.length > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {cardLabels.length}
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(!isAdding)}
            className="h-8 hover:bg-primary/10 hover:text-primary"
          >
            {isAdding ? (
              <X className="h-4 w-4" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1.5" />
                Add
              </>
            )}
          </Button>
        </div>

        {cardLabels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cardLabels.map(({ label }) => (
              <Badge
                key={label.id}
                style={{ backgroundColor: label.color }}
                className="px-3 py-1.5 text-white font-medium hover:opacity-90 transition-opacity cursor-pointer group relative"
                onClick={() => handleToggleLabel(label.id)}
              >
                {label.name || "Untitled"}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3 inline" />
                </span>
              </Badge>
            ))}
          </div>
        )}

        {isAdding && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
            {boardLabels
              .filter((l) => !assignedLabelIds.has(l.id))
              .map((label) => (
                <Button
                  key={label.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleLabel(label.id)}
                  style={{ borderColor: label.color }}
                  className="justify-start hover:bg-secondary/50"
                >
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-sm truncate">
                    {label.name || "Untitled"}
                  </span>
                </Button>
              ))}
          </div>
        )}

        {cardLabels.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No labels added yet
          </p>
        )}
      </div>
    </Card>
  );
};
