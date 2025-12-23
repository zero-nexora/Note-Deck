import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useCard } from "@/hooks/use-card";
import { CreateCardInput } from "@/domain/schemas/card.schema";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface CreateCardProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
}

export const CreateCard = ({ list }: CreateCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const { createCard } = useCard();

  const handleAddCard = async () => {
    const input: CreateCardInput = {
      boardId: list.boardId,
      listId: list.id,
      title: newCardTitle,
      position: list.cards.length,
    };

    await createCard(input);
    setNewCardTitle("");
    setIsAdding(false);
  };

  return (
    <div className="p-2">
      {isAdding ? (
        <div className="space-y-2">
          <Input
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter card title..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCard();
              if (e.key === "Escape") setIsAdding(false);
            }}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleAddCard}
              className="gradient-primary text-primary-foreground"
            >
              Add card
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
};
