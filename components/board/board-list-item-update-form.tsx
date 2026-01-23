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

interface BoardListItemUpdateFormProps {
  list: BoardWithListLabelsAndMembers["lists"][number];
  onUpdate: (listId: string, data: { name: string }) => void;
}

export const BoardListItemUpdateForm = ({
  list,
  onUpdate,
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
    const result = await updateList(list.id, values);

    if (result && values.name !== undefined && values.name !== list.name) {
      onUpdate(list.id, { name: values.name });
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
