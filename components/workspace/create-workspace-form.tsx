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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Awesome Workspace"
                  {...field}
                  className="h-12"
                />
              </FormControl>
              <FormDescription>
                This is the name of your workspace.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-12 w-full">
          {isSubmitting ? <Loading /> : "Create Workspace"}
        </Button>
      </form>
    </Form>
  );
}
