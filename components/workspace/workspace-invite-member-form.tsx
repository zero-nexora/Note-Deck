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
import { Mail, Shield } from "lucide-react";

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
      <div className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="colleague@example.com"
                  type="email"
                  {...field}
                  className="h-10"
                />
              </FormControl>
              <FormDescription className="text-xs">
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
              <FormLabel className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Role
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Admin</span>
                        <span className="text-xs text-muted-foreground">
                          Full access to workspace
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="normal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Normal</span>
                        <span className="text-xs text-muted-foreground">
                          Standard member access
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="observer">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Observer</span>
                        <span className="text-xs text-muted-foreground">
                          Read-only access
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className="text-xs">
                Select the role for the invited member
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isLoading}
          className="w-full h-10"
        >
          {isLoading ? <Loading /> : "Send Invitation"}
        </Button>
      </div>
    </Form>
  );
};
