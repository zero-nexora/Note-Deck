import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import {
  UpdateBoardInput,
  UpdateBoardSchema,
} from "@/domain/schemas/board.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoard } from "@/hooks/use-board";
import { useModal } from "@/stores/modal-store";
import { Loading } from "../common/loading";

interface BoardHeaderNameDescriptionFormProps {
  boardId: string;
  boardName: string;
  boardDescription: string | null;
}

export const BoardHeaderNameDescriptionForm = ({
  boardId,
  boardName,
  boardDescription,
}: BoardHeaderNameDescriptionFormProps) => {
  const { updateBoard } = useBoard();
  const { close } = useModal();

  const form = useForm<UpdateBoardInput>({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      name: boardName,
      description: boardDescription || "",
    },
  });

  const handleSubmit = async (values: UpdateBoardInput) => {
    await updateBoard(boardId, values);
    handleCancel();
  };

  const handleCancel = () => {
    close();
    form.reset({ name: boardName, description: boardDescription || "" });
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Board Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-11 text-base font-semibold focus-visible:ring-primary"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(handleSubmit)();
                    }
                    if (e.key === "Escape") {
                      handleCancel();
                    }
                  }}
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
              <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  className="min-h-24 resize-none text-sm focus-visible:ring-primary"
                  placeholder="Add a description..."
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loading /> : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
