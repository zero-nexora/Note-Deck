"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/hooks/use-board";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import {
  UpdateBoardInput,
  UpdateBoardSchema,
} from "@/domain/schemas/board.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface BoardHeaderNameProps {
  boardId: string;
  boardName: string;
  boardDescription: string | null;
}

export const BoardHeaderNameDescription = ({
  boardId,
  boardDescription,
  boardName,
}: BoardHeaderNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { updateBoard } = useBoard();

  const form = useForm<UpdateBoardInput>({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      name: boardName,
      description: boardDescription || "",
    },
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = async (e: MouseEvent) => {
      if (
        isEditing &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        await updateBoard(boardId, form.getValues());
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, boardId, form, updateBoard]);

  const handleSubmit = async (values: UpdateBoardInput) => {
    await updateBoard(boardId, values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({ name: boardName, description: boardDescription || "" });
  };

  const isLoading = form.formState.isSubmitting;

  if (isEditing) {
    return (
      <Form {...form}>
        <div
          className="space-y-3 p-4 rounded-lg border border-primary/30 bg-secondary/20"
          ref={wrapperRef}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Board Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={inputRef}
                    className="text-xl font-bold h-10 border-border focus-visible:ring-primary"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)();
                      }
                      if (e.key === "Escape") {
                        handleCancel();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    className="text-sm min-h-20 border-border focus-visible:ring-primary resize-none"
                    placeholder="Add a description..."
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading}
              className="h-9"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-9"
            >
              <X className="h-4 w-4 mr-1.5" />
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  return (
    <div className="space-y-2">
      <h1
        className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-secondary/50"
        onDoubleClick={() => setIsEditing(true)}
        title="Double-click to edit"
      >
        {boardName}
      </h1>
      <p
        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary/50 min-h-7"
        onDoubleClick={() => setIsEditing(true)}
        title="Double-click to edit"
      >
        {boardDescription || "Add a description..."}
      </p>
    </div>
  );
};
