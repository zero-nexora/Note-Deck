import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { useCard } from "@/hooks/use-card";
import {
  CreateCardInput,
  CreateCardSchema,
} from "@/domain/schemas/card.schema";
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
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface CreateCardProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
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
    <div>
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
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter card title..."
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
                {isLoading ? <Loading /> : "Add card"}
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
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsAdding(true)}
          className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
};
