import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateCardInput,
  UpdateCardSchema,
} from "@/domain/schemas/card.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCard } from "@/hooks/use-card";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loading } from "../common/loading";
import { Card } from "../ui/card";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardCardItemTitleDescDueDateProps {
  cardId: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardCardItemTitleDescDueDate = ({
  cardId,
  title,
  description,
  dueDate,
  realtimeUtils,
}: BoardCardItemTitleDescDueDateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateCard } = useCard();

  const form = useForm<UpdateCardInput>({
    resolver: zodResolver(UpdateCardSchema),
    defaultValues: {
      title,
      description: description ?? "",
      dueDate: dueDate ?? undefined,
    },
  });

  useEffect(() => {
    form.reset({
      title,
      description: description ?? "",
      dueDate: dueDate ?? undefined,
    });
  }, [title, description, dueDate, form]);

  const handleSubmit = async (values: UpdateCardInput) => {
    const updateData: UpdateCardInput = {};

    if (values.title !== title) updateData.title = values.title;
    if (values.description !== (description ?? "")) {
      updateData.description = values.description || undefined;
    }
    if (values.dueDate !== dueDate) updateData.dueDate = values.dueDate;

    if (Object.keys(updateData).length > 0) {
      const card = await updateCard(cardId, updateData);

      if (card) {
        form.reset({
          title: card.title ?? title,
          description: card.description ?? undefined,
          dueDate: card.dueDate ?? undefined,
        });

        // ✨ Broadcast các thay đổi
        Object.entries(updateData).forEach(([field, value]) => {
          if (
            field === "title" ||
            field === "description" ||
            field === "dueDate"
          ) {
            realtimeUtils.broadcastCardUpdated({
              cardId,
              field: field as "title" | "description" | "dueDate",
              value,
            });
          }
        });
      }
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const isLoading = form.formState.isSubmitting;

  if (!isEditing) {
    return (
      <div className="space-y-5">
        <div className="group relative">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight flex-1">
              {form.getValues("title")}
            </h2>
            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:text-primary shrink-0 h-9 w-9"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {dueDate && (
          <Card className="p-3.5 bg-secondary/50 border-border/60">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Due Date
                </span>
                <span className="font-semibold text-foreground">
                  {format(new Date(form.getValues("dueDate") as Date), "PPP")}
                </span>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Description
          </h3>
          {description ? (
            <Card className="p-4 bg-secondary/30 border-border/50">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {form.getValues("description")}
              </p>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal h-auto py-3 px-4 hover:bg-secondary/80 hover:border-primary/50 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              <span className="text-muted-foreground">
                Add a description to this card...
              </span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-card border-border shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Edit Card Details
        </h3>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-xl font-semibold border-border focus-visible:ring-primary"
                    autoFocus
                    disabled={isLoading}
                    placeholder="Enter card title..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Add a more detailed description..."
                    className="min-h-32 resize-none border-border focus-visible:ring-primary"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Due Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 border-border hover:bg-secondary/80 hover:border-primary/50",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4 opacity-70" />
                        {field.value ? (
                          <span className="font-medium">
                            {format(field.value, "PPP")}
                          </span>
                        ) : (
                          <span>Pick a due date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ?? undefined)}
                      disabled={isLoading}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 font-semibold"
            >
              {isLoading ? <Loading /> : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 h-11 hover:bg-secondary/80"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
