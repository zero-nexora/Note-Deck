import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
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
        {labels.map((label) => (
          <div key={label.id}>
            {editingLabel?.id === label.id ? (
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
        ))}
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
