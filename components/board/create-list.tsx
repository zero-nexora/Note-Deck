import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useList } from "@/hooks/use-list";
import {
  CreateListInput,
  CreateListSchema,
} from "@/domain/schemas/list.schema";
import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Loading } from "../common/loading";

interface CreateListProps {
  board: BoardWithListLabelsAndMembers;
}

export const CreateList = ({ board }: CreateListProps) => {
  const { createList } = useList();

  const [isAddingList, setIsAddingList] = useState(false);

  const form = useForm<CreateListInput>({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      boardId: board.id,
      name: "",
    },
  });

  const handleSubmit = async (values: CreateListInput) => {
    await createList(values);
    setIsAddingList(false);
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="w-[320px] shrink-0">
      {isAddingList ? (
        <div className="rounded-lg bg-card border border-border p-3 shadow-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter list title..."
                        disabled={isLoading}
                        autoFocus
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? <Loading /> : "Add list"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => setIsAddingList(false)}
                  disabled={isLoading}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsAddingList(true)}
          className="w-full justify-start h-auto py-3 px-4 rounded-lg bg-card/50 hover:bg-card border border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add another list
        </Button>
      )}
    </div>
  );
};
