"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardItem } from "./card-item";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { CreateCardInput } from "@/domain/schemas/card.schema";
import { useCard } from "@/hooks/use-card";
import { ActionsMenu } from "../common/actions-menu";
import { useList } from "@/hooks/use-list";

interface ListColumnProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
}

export const ListColumn = ({ list }: ListColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const { createCard } = useCard();
  const { deleteList } = useList();

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

  const handleDeleteList = async () => {
    await deleteList(list.id);
  };

  return (
    <div className="w-72 shrink-0 flex flex-col bg-secondary/50 rounded-xl border border-border/50">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          {list.name}
          <span className="text-xs text-muted-foreground font-normal">
            {list.cards.length}
          </span>
        </h3>

        <ActionsMenu onDelete={handleDeleteList} />
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 pb-2">
          {list.cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </ScrollArea>

      {/* Add Card */}
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
    </div>
  );
};
