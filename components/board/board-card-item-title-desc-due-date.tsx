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
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-foreground flex-1">
              {form.getValues("title")}
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {dueDate && (
          <Card className="px-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-muted-foreground block">
                  Due Date
                </span>
                <span className="text-base font-semibold text-foreground">
                  {format(new Date(form.getValues("dueDate") as Date), "PPP")}
                </span>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            Description
          </h3>
          {description ? (
            <Card className="px-4 bg-card border-border">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {form.getValues("description")}
              </p>
            </Card>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full justify-start h-auto py-3 border-dashed border-border hover:border-primary/50 hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <span>Add a description to this card...</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="px-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Edit Card Details
        </h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancel}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    disabled={isLoading}
                    placeholder="Enter card title..."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Add a more detailed description..."
                    disabled={isLoading}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50 min-h-[120px] resize-none"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-border hover:bg-accent hover:text-accent-foreground",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {field.value ? (
                          <span>{format(field.value, "PPP")}</span>
                        ) : (
                          <span>Pick a due date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto p-0 bg-popover border-border"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ?? undefined)}
                      disabled={isLoading}
                      initialFocus
                      className="bg-popover"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? <Loading /> : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
