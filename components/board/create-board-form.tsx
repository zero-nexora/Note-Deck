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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board name</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Awesome Board"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>What is this board about?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the purpose of this board (optional)"
                  {...field}
                  value={field.value ?? ""}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Optional. Describe the purpose of this board
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="btn-gradient h-12 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loading /> : "Create Board"}
        </Button>
      </form>
    </Form>
  );
};
