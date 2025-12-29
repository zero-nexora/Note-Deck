import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useLabel } from "@/hooks/use-label";
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2 } from "lucide-react";
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

  const { createLabel, deleteLabel, updateLabel } = useLabel();

  const createForm = useForm<CreateLabelInput>({
    resolver: zodResolver(CreateLabelSchema),
    defaultValues: {
      boardId,
      name: "",
      color: "#aabbcc",
    },
  });

  const editForm = useForm<UpdateLabelInput>({
    resolver: zodResolver(UpdateLabelSchema),
    defaultValues: {
      name: "",
      color: "#aabbcc",
    },
  });

  // Sync edit form defaults when editingLabel changes
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
    createForm.reset();
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
  };

  const cancelEditing = () => {
    setEditingLabel(null);
    editForm.reset();
  };

  const isCreating = createForm.formState.isSubmitting;
  const isUpdating = editForm.formState.isSubmitting;

  return (
    <div className="space-y-8">
      {/* Existing Labels */}
      <div>
        <h3 className="text-lg font-medium mb-4">Labels</h3>
        <div className="space-y-4">
          {labels.map((label) => (
            <div key={label.id} className="flex items-start gap-4">
              {editingLabel?.id === label.id ? (
                <Form {...editForm}>
                  <form
                    onSubmit={editForm.handleSubmit(handleUpdate)}
                    className="flex-1 space-y-4"
                  >
                    <FormField
                      control={editForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Label name"
                              disabled={isUpdating}
                              autoFocus
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
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <HexColorPicker
                              color={field.value || "#aabbcc"}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? <Loading /> : "Update"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex justify-between items-center group w-full">
                  <Badge
                    style={{ backgroundColor: label.color }}
                    className="text-foreground px-4 py-1.5 text-sm cursor-default"
                  >
                    {label.name || "Untitled"}
                  </Badge>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 ml-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(label)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(label.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create New Label */}
      <div className="space-y-4">
        <h4 className="font-medium">Create new label</h4>
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="space-y-4"
          >
            <FormField
              control={createForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Label name"
                      disabled={isCreating}
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
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <HexColorPicker
                      color={field.value || "#aabbcc"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isCreating}>
              {isCreating ? <Loading /> : "Create"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
