import {
  CreateInviteInput,
  CreateInviteSchema,
} from "@/domain/schemas/workspace-invite.schema";
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
import { useWorkspaceInvite } from "@/hooks/use-workspace-invite";
import { useModal } from "@/stores/modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface WorkspaceInviteMemberFormProps {
  workspaceId: string;
}

export const WorkspaceInviteMemberForm = ({
  workspaceId,
}: WorkspaceInviteMemberFormProps) => {
  const { createInvite } = useWorkspaceInvite();
  const { close } = useModal();

  const form = useForm({
    resolver: zodResolver(CreateInviteSchema),
    defaultValues: {
      workspaceId: workspaceId,
      email: "",
      role: "normal",
    },
  });

  const handleSubmit = async (values: CreateInviteInput) => {
    await createInvite(values);
    close();
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Enter email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the email address of the person you want to invite
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="observer">Observer</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the role for the person you want to invite
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading}>
          {isLoading ? <Loading /> : "Invite"}
        </Button>
      </form>
    </Form>
  );
};
