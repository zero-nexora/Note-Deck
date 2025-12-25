"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, Plus, X, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface BoardHeaderLabelsProps {
  board: BoardWithListColumnLabelAndMember;
}

const LABEL_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
];

export const BoardHeaderLabels = ({ board }: BoardHeaderLabelsProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/boards/${board.id}/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLabelName.trim(),
          color: newLabelColor,
        }),
      });

      if (!response.ok) throw new Error("Failed to create label");

      toast.success("Label created");
      setNewLabelName("");
      setNewLabelColor(LABEL_COLORS[0]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create label");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLabel = async (labelId: string) => {
    if (!editName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/boards/${board.id}/labels/${labelId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editName.trim() }),
        }
      );

      if (!response.ok) throw new Error("Failed to update label");

      toast.success("Label updated");
      setEditingId(null);
      setEditName("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update label");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/boards/${board.id}/labels/${labelId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete label");

      toast.success("Label deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete label");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 hover:bg-accent/50 rounded-lg px-2 py-1 transition-colors">
          <div className="flex gap-1 flex-wrap">
            {board.labels.slice(0, 3).map((label) => (
              <Badge
                key={label.id}
                variant="outline"
                className="text-xs"
                style={{
                  backgroundColor: `${label.color}20`,
                  borderColor: `${label.color}40`,
                  color: label.color,
                }}
              >
                {label.name}
              </Badge>
            ))}
            {board.labels.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{board.labels.length - 3}
              </Badge>
            )}
          </div>
          <Tag className="w-4 h-4 text-muted-foreground" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Board Labels ({board.labels.length})</DialogTitle>
          <DialogDescription>
            Create and manage labels for this board
          </DialogDescription>
        </DialogHeader>

        {/* Create New Label */}
        <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
          <Input
            placeholder="Label name"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            maxLength={50}
          />
          <div className="flex flex-wrap gap-2">
            {LABEL_COLORS.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: newLabelColor === color ? "#000" : "transparent",
                }}
                onClick={() => setNewLabelColor(color)}
              />
            ))}
          </div>
          <Button
            onClick={handleCreateLabel}
            disabled={isLoading || !newLabelName.trim()}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Label
          </Button>
        </div>

        {/* Existing Labels */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {board.labels.map((label) => (
            <div
              key={label.id}
              className="flex items-center gap-2 p-2 rounded-lg border"
              style={{
                backgroundColor: `${label.color}10`,
                borderColor: `${label.color}30`,
              }}
            >
              {editingId === label.id ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleUpdateLabel(label.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateLabel(label.id);
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setEditName("");
                    }
                  }}
                  className="h-8"
                  autoFocus
                />
              ) : (
                <>
                  <Badge
                    className="flex-1 justify-start"
                    style={{
                      backgroundColor: `${label.color}20`,
                      borderColor: `${label.color}40`,
                      color: label.color,
                    }}
                  >
                    {label.name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingId(label.id);
                      setEditName(label.name);
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDeleteLabel(label.id)}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>

        {board.labels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No labels yet. Create one to get started!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
