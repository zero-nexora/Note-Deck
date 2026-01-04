import {
  CreateBoardInput,
  CreateBoardSchema,
} from "@/domain/schemas/board.schema";
import z from "zod";
import { Sparkles } from "lucide-react";
import { useBoard } from "@/hooks/use-board";
import { useModal } from "@/stores/modal-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface CreateBoardFormProps {
  workspaceId: string;
}

export const CreateBoardForm = ({ workspaceId }: CreateBoardFormProps) => {
  const { createBoard } = useBoard();
  const { close } = useModal();

  const form = useForm<z.infer<typeof CreateBoardSchema>>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      workspaceId,
      description: "",
      name: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof CreateBoardSchema>) => {
    const input: CreateBoardInput = {
      workspaceId: values.workspaceId,
      name: values.name,
      description: values.description,
    };
    await createBoard(input);
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
              <FormLabel className="text-foreground">Board Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Product Roadmap, Marketing Campaign"
                  {...field}
                  disabled={isSubmitting}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                Give your board a clear, descriptive name
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
                  placeholder="Describe what this board is for and what you'll be tracking..."
                  {...field}
                  value={field.value ?? ""}
                  disabled={isSubmitting}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px] resize-none"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                Optional. Help your team understand the purpose of this board
              </FormDescription>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={isSubmitting}
            className="border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loading />
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Board
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
