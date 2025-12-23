import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useList } from "@/hooks/use-list";
import { CreateListInput } from "@/domain/schemas/list.schema";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface CreateListProps {
  board: BoardWithListColumnLabelAndMember;
}

export const CreateList = ({ board }: CreateListProps) => {
  const { createList } = useList();

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const handleAddList = async () => {
    const input: CreateListInput = {
      boardId: board.id,
      name: newListTitle,
      position: board.lists.length,
    };
    await createList(input);
    setNewListTitle("");
    setIsAddingList(false);
  };

  return (
    <div className="w-72 shrink-0">
      {isAddingList ? (
        <div className="bg-secondary/50 rounded-xl border border-border/50 p-3 space-y-2">
          <Input
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddList();
              if (e.key === "Escape") setIsAddingList(false);
            }}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleAddList}>
              Add list
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAddingList(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setIsAddingList(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add another list
        </Button>
      )}
    </div>
  );
};
