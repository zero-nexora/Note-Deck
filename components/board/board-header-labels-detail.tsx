import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useLabel } from "@/hooks/use-label";
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Plus, X, Check, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  CreateLabelInput,
  CreateLabelSchema,
  UpdateLabelInput,
  UpdateLabelSchema,
} from "@/domain/schemas/label.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loading } from "../common/loading";
import { Card } from "../ui/card";

interface BoardHeaderLabelsDetailProps {
  boardId: string;
  boardLabels: BoardWithListColumnLabelAndMember["labels"];
}

export const BoardHeaderLabelsDetail = ({
  boardId,
  boardLabels: initialLabels,
}: BoardHeaderLabelsDetailProps) => {
  const [labels, setLabels] = useState(initialLabels);
  const [editingLabel, setEditingLabel] = useState<
    BoardWithListColumnLabelAndMember["labels"][0] | null
  >(null);
  const [isCreating, setIsCreating] = useState(false);

  const { createLabel, deleteLabel, updateLabel } = useLabel();

  const createForm = useForm<CreateLabelInput>({
    resolver: zodResolver(CreateLabelSchema),
    defaultValues: {
      boardId,
      name: "",
      color: "#3b82f6",
    },
  });

  const editForm = useForm<UpdateLabelInput>({
    resolver: zodResolver(UpdateLabelSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
    },
  });

  useEffect(() => {
    if (editingLabel) {
      editForm.reset({
        name: editingLabel.name || "",
        color: editingLabel.color,
      });
    }
  }, [editingLabel, editForm]);

  const handleCreate = async (values: CreateLabelInput) => {
    const newLabel = await createLabel(values);
    if (newLabel) {
      setLabels((prev) => [...prev, newLabel]);
    }
    createForm.reset({ boardId, name: "", color: "#3b82f6" });
    setIsCreating(false);
  };

  const handleUpdate = async (values: UpdateLabelInput) => {
    if (!editingLabel) return;
    await updateLabel(editingLabel.id, values);
    setLabels((prev) =>
      prev.map((l) => (l.id === editingLabel.id ? { ...l, ...values } : l))
    );
    setEditingLabel(null);
    editForm.reset();
  };

  const handleDelete = async (id: string) => {
    await deleteLabel({ id });
    setLabels((prev) => prev.filter((l) => l.id !== id));
    if (editingLabel?.id === id) {
      setEditingLabel(null);
      editForm.reset();
    }
  };

  const startEditing = (
    label: BoardWithListColumnLabelAndMember["labels"][0]
  ) => {
    setEditingLabel(label);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingLabel(null);
    editForm.reset();
  };

  const isCreatingLoading = createForm.formState.isSubmitting;
  const isUpdating = editForm.formState.isSubmitting;

  return (
    <div className="space-y-6">
      {/* Existing Labels */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Labels</h3>
            {labels.length > 0 && (
              <Badge variant="secondary" className="rounded-full">
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
            className="h-8 hover:bg-primary/10 hover:text-primary"
          >
            {isCreating ? (
              <>
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1.5" /> Create
              </>
            )}
          </Button>
        </div>

        {/* Labels List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {labels.map((label) => (
            <div key={label.id}>
              {editingLabel?.id === label.id ? (
                <Card className="p-4 bg-secondary/30 border-border">
                  <Form {...editForm}>
                    <form className="space-y-4">
                      <FormField
                        control={editForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Label Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Label name"
                                disabled={isUpdating}
                                autoFocus
                                className="h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editForm.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Color
                            </FormLabel>
                            <FormControl>
                              <div className="flex justify-center">
                                <HexColorPicker
                                  color={field.value || "#3b82f6"}
                                  onChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={editForm.handleSubmit(handleUpdate)}
                          disabled={isUpdating}
                          className="h-9"
                        >
                          {isUpdating ? (
                            <Loading />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1.5" /> Update
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={isUpdating}
                          className="h-9"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </Card>
              ) : (
                <div className="group flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
                  <Badge
                    style={{ backgroundColor: label.color }}
                    className="px-4 py-1.5 text-sm font-medium text-white"
                  >
                    {label.name || "Untitled"}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEditing(label)}
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(label.id)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {labels.length === 0 && !isCreating && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
              <Tag className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              No labels yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Create labels to organize your cards
            </p>
          </div>
        )}
      </div>

      {isCreating && (
        <Card className="p-4 bg-primary/5 border-primary/30">
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreate)}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-foreground">
                  Create New Label
                </h4>
              </div>
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Label Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Bug, Feature, Priority"
                        disabled={isCreatingLoading}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Color
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <HexColorPicker
                          color={field.value || "#3b82f6"}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isCreatingLoading}
                className="w-full h-10"
              >
                {isCreatingLoading ? (
                  <Loading />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1.5" /> Create Label
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
