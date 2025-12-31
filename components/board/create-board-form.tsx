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
  CreateBoardInput,
  CreateBoardSchema,
} from "@/domain/schemas/board.schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoard } from "@/hooks/use-board";
import { useModal } from "@/stores/modal-store";
import { Sparkles } from "lucide-react";

interface CreateBoardProps {
  workspaceId: string;
}

export const CreateBoardForm = ({ workspaceId }: CreateBoardProps) => {
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Board Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Board Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Product Roadmap, Marketing Campaign"
                  {...field}
                  disabled={isSubmitting}
                  className="h-10"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Give your board a clear, descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this board is for and what you'll be tracking..."
                  {...field}
                  value={field.value ?? ""}
                  disabled={isSubmitting}
                  className="min-h-20 resize-none"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Optional. Help your team understand the purpose of this board
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10"
            onClick={close}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 h-10" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loading />
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Board
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
