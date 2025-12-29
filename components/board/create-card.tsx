import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useCard } from "@/hooks/use-card";
import {
  CreateCardInput,
  CreateCardSchema,
} from "@/domain/schemas/card.schema";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useForm } from "react-hook-form";
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
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface CreateCardProps {
  list: BoardWithListColumnLabelAndMember["lists"][number];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const CreateCard = ({ list, realtimeUtils }: CreateCardProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const { createCard } = useCard();

  const form = useForm<CreateCardInput>({
    resolver: zodResolver(CreateCardSchema),
    defaultValues: {
      listId: list.id,
      title: "",
    },
  });

  const handleSubmit = async (values: CreateCardInput) => {
    const result = await createCard(values);
    if (result)
      realtimeUtils?.broadcastCardCreated({
        cardId: result.id,
        listId: list.id,
      });
    setIsAdding(false);
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="p-2">
      {isAdding ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter card title..."
                      autoFocus
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="gradient-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : "Add card"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => setIsAdding(false)}
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
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
};
