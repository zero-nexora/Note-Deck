import {
  UpdateBoardInput,
  UpdateBoardSchema,
} from "@/domain/schemas/board.schema";
import { useBoard } from "@/hooks/use-board";
import { useModal } from "@/stores/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
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
    close();
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
              <FormLabel className="text-foreground">Board Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  className="bg-input border-border text-foreground focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
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
                  placeholder="Add a description..."
                  disabled={isLoading}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px] resize-none"
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loading /> : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
