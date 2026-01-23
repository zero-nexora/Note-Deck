import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { useLabel } from "@/hooks/use-label";
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Plus, X, Check, Tag } from "lucide-react";
import {
  CreateLabelInput,
  CreateLabelSchema,
  UpdateLabelInput,
  UpdateLabelSchema,
} from "@/domain/schemas/label.schema";
import { Card } from "../ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Loading } from "../common/loading";

type Label = BoardWithListLabelsAndMembers["labels"][0];

interface BoardHeaderLabelsDetailProps {
  boardId: string;
  initialLabels: Label[];
}

export const BoardHeaderLabelsDetail = ({
  boardId,
  initialLabels,
}: BoardHeaderLabelsDetailProps) => {
  const [labels, setLabels] = useState<Label[]>(initialLabels);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { createLabel, deleteLabel, updateLabel } = useLabel();

  const createForm = useForm<CreateLabelInput>({
    resolver: zodResolver(CreateLabelSchema),
    defaultValues: { boardId, name: "", color: "#3b82f6" },
  });

  const editForm = useForm<UpdateLabelInput>({
    resolver: zodResolver(UpdateLabelSchema),
    defaultValues: { name: "", color: "#3b82f6" },
  });

  useEffect(() => {
    if (editingLabel) {
      const currentLabel = labels.find((l) => l.id === editingLabel.id);
      if (currentLabel) {
        editForm.reset({
          name: currentLabel.name,
          color: currentLabel.color,
        });
      }
    }
  }, [editingLabel, labels, editForm]);

  const startEditing = (label: Label) => {
    setEditingLabel(label);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingLabel(null);
    editForm.reset();
  };

  const handleCreate = async (values: CreateLabelInput) => {
    try {
      const newLabel = await createLabel(values);
      if (newLabel) {
        setLabels((prev) => [...prev, newLabel]);
        createForm.reset({ boardId, name: "", color: "#3b82f6" });
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating label:", error);
    }
  };

  const handleUpdate = async (values: UpdateLabelInput) => {
    if (!editingLabel) return;

    try {
      const currentLabel = labels.find((l) => l.id === editingLabel.id);
      if (!currentLabel) return;

      const updates: UpdateLabelInput = {};
      if (values.name !== currentLabel.name) updates.name = values.name;
      if (values.color !== currentLabel.color) updates.color = values.color;

      if (Object.keys(updates).length > 0) {
        const updatedLabel = await updateLabel(editingLabel.id, updates);
        if (updatedLabel) {
          setLabels((prev) =>
            prev.map((label) =>
              label.id === editingLabel.id ? { ...label, ...updates } : label,
            ),
          );
        }
      }

      cancelEditing();
    } catch (error) {
      console.error("Error updating label:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteLabel({ id });
      if (success) {
        setLabels((prev) => prev.filter((label) => label.id !== id));
        if (editingLabel?.id === id) cancelEditing();
      }
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  const isCreatingLoading = createForm.formState.isSubmitting;
  const isUpdating = editForm.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Labels</h3>
          {labels.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
            >
              {labels.length}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setIsCreating(!isCreating);
            setEditingLabel(null);
          }}
          className="text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {isCreating ? (
            <>
              <X className="h-4 w-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" /> Create
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {labels.map((label) => {
          const isEditing = editingLabel?.id === label.id;

          return (
            <div key={label.id}>
              {isEditing ? (
                <Card className="p-4 bg-card border-border">
                  <Form {...editForm}>
                    <form className="space-y-4">
                      <FormField
                        control={editForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Label name"
                                disabled={isUpdating}
                                autoFocus
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50"
                              />
                            </FormControl>
                            <FormMessage className="text-destructive" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editForm.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              Color
                            </FormLabel>
                            <FormControl>
                              <div className="flex justify-center p-4 bg-muted rounded-lg border border-border">
                                <HexColorPicker
                                  color={field.value || "#3b82f6"}
                                  onChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-destructive" />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={editForm.handleSubmit(handleUpdate)}
                          disabled={isUpdating}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loading />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Update
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={isUpdating}
                          className="border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </Card>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group">
                  <Badge
                    style={{ backgroundColor: label.color }}
                    className="text-white font-medium px-3 py-1"
                  >
                    {label.name || "Untitled"}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEditing(label)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(label.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {labels.length === 0 && !isCreating && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium">No labels yet</p>
          <p className="text-sm text-muted-foreground">
            Create labels to organize your cards
          </p>
        </div>
      )}

      {isCreating && (
        <Card className="p-6 bg-card border-border">
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreate)}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Plus className="h-5 w-5 text-primary" />
                <h4 className="text-base font-semibold text-foreground">
                  Create New Label
                </h4>
              </div>

              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Label Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Bug, Feature, Priority"
                        disabled={isCreatingLoading}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Color</FormLabel>
                    <FormControl>
                      <div className="flex justify-center p-4 bg-muted rounded-lg border border-border">
                        <HexColorPicker
                          color={field.value || "#3b82f6"}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isCreatingLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingLoading ? (
                  <Loading />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Create Label
                  </>
                )}
              </Button>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
};
