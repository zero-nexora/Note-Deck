import { CheckSquare, Plus, Trash2, X, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useChecklist } from "@/hooks/use-checklist";
import { useChecklistItem } from "@/hooks/use-checklist-item";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateChecklistInput,
  CreateChecklistSchema,
} from "@/domain/schemas/checklist.schema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useBoardRealtime } from "@/hooks/use-board-realtime";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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

      realtimeUtils.broadcastCardUpdated({
        cardId,
        field: "coverImage",
        value: "checklist_added",
      });
    }
    createChecklistForm.reset();
    setAddingChecklist(false);
  };

  const handleDeleteChecklist = async (id: string) => {
    await deleteChecklist({ id });
    setChecklists((prev) => prev.filter((cl) => cl.id !== id));

    realtimeUtils.broadcastCardUpdated({
      cardId,
      field: "coverImage",
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

    realtimeUtils.broadcastCardUpdated({
      cardId,
      field: "coverImage",
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

      realtimeUtils.broadcastCardUpdated({
        cardId,
        field: "coverImage",
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

    realtimeUtils.broadcastCardUpdated({
      cardId,
      field: "coverImage",
      value: "checklist_item_deleted",
    });
  };

  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Checklists
          </h3>
          {checklists.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
            >
              {checklists.length}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setAddingChecklist(!addingChecklist)}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {addingChecklist ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </>
          )}
        </Button>
      </div>

      {addingChecklist && (
        <Form {...createChecklistForm}>
          <div className="p-4 bg-muted/30">
            <div className="flex items-center gap-2">
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
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
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
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </Form>
      )}

      <div className="p-4 space-y-6">
        {checklists.map((checklist) => {
          const completedCount = checklist.items.filter(
            (i) => i.isCompleted
          ).length;
          const totalCount = checklist.items.length;
          const progress =
            totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

          return (
            <div key={checklist.id} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    {/* <h4 className="font-semibold text-foreground">
                      {checklist.title}
                    </h4> */}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteChecklist(checklist.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {progress === 100 ? "Completed" : "Progress"}
                    </span>
                    <span className="text-muted-foreground">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              {checklist.items.length > 0 && (
                <div className="space-y-2">
                  {checklist.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      <Checkbox
                        checked={item.isCompleted}
                        onCheckedChange={(checked) =>
                          handleToggleItem(item.id, !!checked)
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      {/* <span
                        className={cn(
                          "flex-1 text-sm",
                          item.isCompleted
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {item.text}
                      </span> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                {addingItemTo === checklist.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add an item..."
                      autoFocus
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddItem(checklist.id);
                        }
                        if (e.key === "Escape") {
                          setAddingItemTo(null);
                          setNewItemText("");
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddItem(checklist.id)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddingItemTo(checklist.id)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add an item
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {checklists.length === 0 && !addingChecklist && (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
            <CheckSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground mb-1">No checklists yet</p>
          <p className="text-sm text-muted-foreground">
            Click &quot;Add&quot; to create a checklist
          </p>
        </div>
      )}
    </Card>
  );
};
