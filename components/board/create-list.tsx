import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useList } from "@/hooks/use-list";
import {
  CreateListInput,
  CreateListSchema,
} from "@/domain/schemas/list.schema";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
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
  board: BoardWithListColumnLabelAndMember;
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
    <div className="w-72 shrink-0">
      {isAddingList ? (
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? <Loading /> : "Add list"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => setIsAddingList(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
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
