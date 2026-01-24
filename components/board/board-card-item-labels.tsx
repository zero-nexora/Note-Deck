import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag, Plus, X } from "lucide-react";
import { useCardLabel } from "@/hooks/use-card-label";
import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers } from "@/domain/types/card.type";
import { useConfirm } from "@/stores/confirm-store";
import { Skeleton } from "../ui/skeleton";

interface BoardCardItemLabelsProps {
  cardId: string;
  cardLabels: NonNullable<CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers>["cardLabels"];
  boardLabels: BoardWithListLabelsAndMembers["labels"];
}

export const BoardCardItemLabels = ({
  cardId,
  cardLabels: initialCardLabels = [],
  boardLabels = [],
}: BoardCardItemLabelsProps) => {
  const { open } = useConfirm();
  const [isAdding, setIsAdding] = useState(false);
  const [cardLabels, setCardLabels] = useState(initialCardLabels);
  const { addCardLabel, removeCardLabel } = useCardLabel();

  useEffect(() => {
    setCardLabels(initialCardLabels);
  }, [initialCardLabels]);

  const assignedLabelIds = new Set(cardLabels.map((cl) => cl.label.id));

  const handleToggleLabel = async (labelId: string) => {
    const isAssigned = assignedLabelIds.has(labelId);

    open({
      title: isAssigned ? "Remove label from card?" : "Add label to card?",
      description: isAssigned
        ? `Are you sure you want to remove this label from this card?`
        : `Do you want to add this label to this card?`,
      onConfirm: async () => {
        if (isAssigned) {
          await removeCardLabel({ cardId, labelId });

          setCardLabels((prev) => prev.filter((cl) => cl.label.id !== labelId));
        } else {
          const newCardLabel = await addCardLabel({ cardId, labelId });

          if (newCardLabel) {
            const boardLabel = boardLabels.find((l) => l.id === labelId);

            if (boardLabel) {
              const cardLabel = {
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
              };

              setCardLabels((prev) => [...prev, cardLabel]);
            }
          }

          setIsAdding(false);
        }
      },
    });
  };

  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Labels</h3>
          {cardLabels.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
            >
              {cardLabels.length}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsAdding(!isAdding)}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {isAdding ? (
            <X className="h-4 w-4" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </>
          )}
        </Button>
      </div>

      {cardLabels.length > 0 && (
        <div className="p-4 flex flex-wrap gap-2">
          {cardLabels.map(({ label }) => (
            <Badge
              key={label.id}
              style={{ backgroundColor: label.color }}
              className="text-white font-medium px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity group"
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
        <div className="p-4 space-y-2 border-t border-border bg-muted/30">
          {boardLabels
            .filter((l) => !assignedLabelIds.has(l.id))
            .map((label) => (
              <Button
                key={label.id}
                variant="outline"
                size="sm"
                onClick={() => handleToggleLabel(label.id)}
                style={{ borderColor: label.color }}
                className="w-full justify-start gap-3 hover:bg-accent hover:text-accent-foreground"
              >
                <div
                  className="h-4 w-4 rounded-full shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <span className="font-medium">{label.name || "Untitled"}</span>
              </Button>
            ))}
        </div>
      )}

      {cardLabels.length === 0 && !isAdding && (
        <div className="p-6 text-center">
          <p className="text-sm text-muted-foreground">No labels added yet</p>
        </div>
      )}
    </Card>
  );
};

export const BoardCardItemLabelsSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>

      <div className="p-4 flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </Card>
  );
};
