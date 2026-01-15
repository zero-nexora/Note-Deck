"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  UpdateWorkspaceNameInput,
  UpdateWorkspaceNameSchema,
} from "@/domain/schemas/workspace.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface WorkspaceNameEditorProps {
  name: string;
  onSubmit: (values: UpdateWorkspaceNameInput) => Promise<void>;
  onCancel: () => void;
}

export const WorkspaceNameEditor = ({
  name,
  onSubmit,
  onCancel,
}: WorkspaceNameEditorProps) => {
  const form = useForm<UpdateWorkspaceNameInput>({
    resolver: zodResolver(UpdateWorkspaceNameSchema),
    defaultValues: { name },
  });

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <div className="flex items-center gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  disabled={isLoading}
                  className="h-9 w-[200px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                    if (e.key === "Escape") onCancel();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size="icon"
          variant="ghost"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Check className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Form>
  );
};
