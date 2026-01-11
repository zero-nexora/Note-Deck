import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loading } from "../common/loading";
import {
  UpdateBoardInput,
  UpdateBoardSchema,
} from "@/domain/schemas/board.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoard } from "@/hooks/use-board";
import { useModal } from "@/stores/modal-store";
import { BoardWithMember } from "@/domain/types/board.type";

interface UpdateBoardFormProps {
  board: BoardWithMember;
}

export const UpdateBoardForm = ({ board }: UpdateBoardFormProps) => {
  const { updateBoard } = useBoard();
  const { close } = useModal();

  const form = useForm<UpdateBoardInput>({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      description: board.description || "",
      name: board.name,
    },
  });

  const handleSubmit = async (values: UpdateBoardInput) => {
    const input: UpdateBoardInput = {
      name: values.name,
      description: values.description,
    };
    await updateBoard(board.id, input);
    close();
    form.reset();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Board name</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Awesome Board"
                  {...field}
                  disabled={isSubmitting}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                What is this board about?
              </FormDescription>
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
                  placeholder="Describe the purpose of this board (optional)"
                  {...field}
                  value={field.value ?? ""}
                  disabled={isSubmitting}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px] resize-none"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                Optional. Describe the purpose of this board
              </FormDescription>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loading /> : "Update Board"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
