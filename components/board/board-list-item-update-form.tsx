import {
  UpdateListInput,
  UpdateListSchema,
} from "@/domain/schemas/list.schema";
import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { useList } from "@/hooks/use-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "../ui/button";
import { Loading } from "../common/loading";
import { useModal } from "@/stores/modal-store";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardListItemUpdateFormProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardListItemUpdateForm = ({
  list,
  realtimeUtils,
}: BoardListItemUpdateFormProps) => {
  const { updateList } = useList();
  const { close } = useModal();

  const form = useForm<UpdateListInput>({
    resolver: zodResolver(UpdateListSchema),
    defaultValues: {
      name: list.name,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: UpdateListInput) => {
    await updateList(list.id, values);

    if (values.name !== undefined && values.name !== list.name) {
      realtimeUtils?.broadcastListUpdated({
        listId: list.id,
        field: "title",
        value: values.name,
      });
    }

    form.reset();
    close();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>List name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter a new name for this list"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                This name will be shown on the board.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? <Loading /> : "Save changes"}
        </Button>
      </form>
    </Form>
  );
};
