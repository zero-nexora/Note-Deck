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
import { Mail, Shield, CheckCircle2 } from "lucide-react";

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
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                <Mail className="h-4 w-4 text-primary" />
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="colleague@example.com"
                  type="email"
                  {...field}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground text-sm">
                Enter the email address of the person you want to invite
              </FormDescription>
              <FormMessage className="text-destructive text-sm font-medium" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-foreground font-medium">
                <Shield className="h-4 w-4 text-primary" />
                Role
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-background border-border text-foreground hover:bg-accent focus:ring-ring focus:ring-2 focus:ring-offset-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    <SelectItem
                      value="admin"
                      className="hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex flex-col gap-1 py-1">
                        <span className="font-semibold text-foreground flex items-center gap-2">
                          Admin
                          <Shield className="h-3.5 w-3.5 text-primary" />
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Full access to workspace settings and members
                        </span>
                      </div>
                    </SelectItem>

                    <SelectItem
                      value="normal"
                      className="hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex flex-col gap-1 py-1">
                        <span className="font-semibold text-foreground flex items-center gap-2">
                          Normal
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Standard member with regular permissions
                        </span>
                      </div>
                    </SelectItem>

                    <SelectItem
                      value="observer"
                      className="hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex flex-col gap-1 py-1">
                        <span className="font-semibold text-foreground">
                          Observer
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Read-only access to workspace content
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className="text-muted-foreground text-sm">
                Select the role and permissions for the invited member
              </FormDescription>
              <FormMessage className="text-destructive text-sm font-medium" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={close}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            Cancel
          </Button>

          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm min-w-[140px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loading />
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Send Invitation</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
};
