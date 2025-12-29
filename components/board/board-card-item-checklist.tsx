import { useState, useEffect } from "react";
import { CheckSquare, Plus, Trash2, X, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChecklist } from "@/hooks/use-checklist";
import { useChecklistItem } from "@/hooks/use-checklist-item";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateChecklistInput,
  CreateChecklistSchema,
} from "@/domain/schemas/check-list.schema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardCardItemChecklistsProps {
  cardId: string;
  cardChecklists: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["checklists"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardCardItemChecklists = ({
  cardId,
  cardChecklists: initialChecklists = [],
  realtimeUtils,
}: BoardCardItemChecklistsProps) => {
  const [checklists, setChecklists] = useState(initialChecklists);
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState("");

  const { createChecklist, deleteChecklist } = useChecklist();
  const { createChecklistItem, toggleChecklistItem, deleteChecklistItem } =
    useChecklistItem();

  useEffect(() => {
    setChecklists(initialChecklists);
  }, [initialChecklists]);

  const createChecklistForm = useForm<CreateChecklistInput>({
    resolver: zodResolver(CreateChecklistSchema),
    defaultValues: { cardId, title: "" },
  });

  const handleCreateChecklist = async (values: CreateChecklistInput) => {
    const newChecklist = await createChecklist(values);
    if (newChecklist) {
      setChecklists((prev) => [...prev, { ...newChecklist, items: [] }]);

      // ✨ Broadcast card updated (checklist added)
      realtimeUtils.broadcastCardUpdated({
        cardId,
        field: "coverImage", // Sử dụng field tạm thời
        value: "checklist_added",
      });
    }
    createChecklistForm.reset();
    setAddingChecklist(false);
  };

  const handleDeleteChecklist = async (id: string) => {
    await deleteChecklist({ id });
    setChecklists((prev) => prev.filter((cl) => cl.id !== id));

    // ✨ Broadcast card updated (checklist deleted)
    realtimeUtils.broadcastCardUpdated({
      cardId,
      field: "coverImage", // Sử dụng field tạm thời
      value: "checklist_deleted",
    });
  };

  const handleToggleItem = async (id: string, isCompleted: boolean) => {
    await toggleChecklistItem({ id, isCompleted });
    setChecklists((prev) =>
      prev.map((cl) => ({
        ...cl,
        items: cl.items.map((item) =>
          item.id === id ? { ...item, isCompleted } : item
        ),
      }))
    );

    // ✨ Broadcast card updated (checklist item toggled)
    realtimeUtils.broadcastCardUpdated({
      cardId,
      field: "coverImage", // Sử dụng field tạm thời
      value: "checklist_item_toggled",
    });
  };

  const handleAddItem = async (checklistId: string) => {
    if (!newItemText.trim()) return;
    const newItem = await createChecklistItem({
      checklistId,
      text: newItemText.trim(),
    });
    if (newItem) {
      setChecklists((prev) =>
        prev.map((cl) =>
          cl.id === checklistId ? { ...cl, items: [...cl.items, newItem] } : cl
        )
      );

      // ✨ Broadcast card updated (checklist item added)
      realtimeUtils.broadcastCardUpdated({
        cardId,
        field: "coverImage", // Sử dụng field tạm thời
        value: "checklist_item_added",
      });
    }
    setNewItemText("");
    setAddingItemTo(null);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteChecklistItem({ id });
    setChecklists((prev) =>
      prev.map((cl) => ({
        ...cl,
        items: cl.items.filter((item) => item.id !== id),
      }))
    );

    // ✨ Broadcast card updated (checklist item deleted)
    realtimeUtils.broadcastCardUpdated({
      cardId,
      field: "coverImage", // Sử dụng field tạm thời
      value: "checklist_item_deleted",
    });
  };

  return (
    <Card className="p-5 bg-card border-border/60">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <CheckSquare className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Checklists</h3>
            {checklists.length > 0 && (
              <Badge
                variant="secondary"
                className="rounded-full h-5 min-w-5 px-1.5"
              >
                {checklists.length}
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAddingChecklist(!addingChecklist)}
            className="h-8 hover:bg-primary/10 hover:text-primary"
          >
            {addingChecklist ? (
              <>
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1.5" />
                Add
              </>
            )}
          </Button>
        </div>

        {/* Add Checklist Form */}
        {addingChecklist && (
          <Form {...createChecklistForm}>
            <div className="p-3 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
              <div className="flex gap-2">
                <FormField
                  control={createChecklistForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Checklist title..."
                          autoFocus
                          {...field}
                          className="bg-background h-9"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              createChecklistForm.handleSubmit(
                                handleCreateChecklist
                              )();
                            }
                            if (e.key === "Escape") {
                              setAddingChecklist(false);
                              createChecklistForm.reset();
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={createChecklistForm.handleSubmit(
                    handleCreateChecklist
                  )}
                  className="h-9"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </Form>
        )}

        {/* Checklists */}
        <div className="space-y-4">
          {checklists.map((checklist) => {
            const completedCount = checklist.items.filter(
              (i) => i.isCompleted
            ).length;
            const totalCount = checklist.items.length;
            const progress =
              totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            return (
              <div
                key={checklist.id}
                className="rounded-lg border border-border bg-secondary/30 overflow-hidden"
              >
                {/* Checklist Header */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CheckSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                      <h4 className="font-semibold text-foreground truncate">
                        {checklist.title}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive shrink-0"
                      onClick={() => handleDeleteChecklist(checklist.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        {progress === 100 ? "Completed" : "Progress"}
                      </span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>

                {/* Checklist Items */}
                {checklist.items.length > 0 && (
                  <div className="px-4 pb-3 space-y-1">
                    {checklist.items.map((item) => (
                      <div
                        key={item.id}
                        className="group flex items-center gap-3 p-2.5 rounded-md hover:bg-secondary/50 transition-colors"
                      >
                        <Checkbox
                          checked={item.isCompleted}
                          onCheckedChange={(checked) =>
                            handleToggleItem(item.id, !!checked)
                          }
                          className="shrink-0"
                        />
                        <span
                          className={`flex-1 text-sm leading-tight ${
                            item.isCompleted
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {item.text}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity shrink-0"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Item */}
                <div className="px-4 pb-4">
                  {addingItemTo === checklist.id ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an item..."
                        autoFocus
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddItem(checklist.id);
                          }
                          if (e.key === "Escape") {
                            setAddingItemTo(null);
                            setNewItemText("");
                          }
                        }}
                        className="h-9 flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddItem(checklist.id)}
                        className="h-9 shrink-0"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-9 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      onClick={() => setAddingItemTo(checklist.id)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add an item
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {checklists.length === 0 && !addingChecklist && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/50 mb-3">
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No checklists yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click &quot;Add&quot; to create a checklist
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
