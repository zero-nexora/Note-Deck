"use client";

import { useWorkspace } from "@/hooks/use-workspace";
import {
  CreateWorkspaceInput,
  CreateWorkspaceSchema,
} from "@/domain/schemas/workspace.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loading } from "../common/loading";
import { useModal } from "@/stores/modal-store";
import { Sparkles } from "lucide-react";

export function CreateWorkspaceForm() {
  const { createWorkspace } = useWorkspace();
  const { close } = useModal();

  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      ownerId: "",
      name: "",
    },
  });

  const handleSubmit = async (values: CreateWorkspaceInput) => {
    await createWorkspace({
      name: values.name,
      ownerId: values.ownerId,
    });
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
              <FormLabel className="text-foreground">Workspace name</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Awesome Workspace"
                  {...field}
                  disabled={isSubmitting}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                This is the name of your workspace.
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
                Create Workspace
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
