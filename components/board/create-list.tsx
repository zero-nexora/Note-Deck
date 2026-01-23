"use client";

import { useState } from "react";
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
import { useBoardRealtimeLists } from "@/hooks/use-board-realtime-lists";
import { User } from "@/domain/types/user.type";

interface CreateListProps {
  board: BoardWithListLabelsAndMembers;
  user: User;
}

export const CreateList = ({ board, user }: CreateListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { createList } = useList();
  const { broadcastListCreated } = useBoardRealtimeLists({ user });

  const form = useForm<CreateListInput>({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      boardId: board.id,
      name: "",
    },
  });

  const handleSubmit = async (values: CreateListInput) => {
    const result = await createList(values);
    if (result) {
      broadcastListCreated(result);
    }
    setIsAdding(false);
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="w-[320px] shrink-0">
      {isAdding ? (
        <div className="rounded-lg bg-card border shadow-sm p-3">
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
                        autoFocus
                        disabled={isLoading}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button
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
                  onClick={() => setIsAdding(false)}
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
          onClick={() => setIsAdding(true)}
          className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a list
        </Button>
      )}
    </div>
  );
};
