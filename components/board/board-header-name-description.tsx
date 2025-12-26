"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useBoard } from "@/hooks/use-board";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateBoardInput,
  UpdateBoardSchema,
} from "@/domain/schemas/board.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface BoardHeaderNameProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardHeaderNameDescription = ({ board }: BoardHeaderNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLFormElement>(null);

  const { updateBoard } = useBoard();

  const form = useForm<UpdateBoardInput>({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      name: board.name,
      description: board.description || "",
    },
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = async (e: MouseEvent) => {
      if (
        isEditing &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        await updateBoard(board.id, form.getValues());
        setIsEditing(false);
        form.reset();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  const handleSubmit = async (values: UpdateBoardInput) => {
    await updateBoard(board.id, values);
    setIsEditing(false);
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  if (isEditing) {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-2"
          ref={wrapperRef}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={inputRef}
                    className="text-2xl font-bold h-auto py-1 px-2 border-primary/50 focus-visible:ring-primary"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>Change the name of the board</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    ref={textareaRef}
                    value={field.value ?? ""}
                    className="text-sm min-h-[60px] border-primary/50 focus-visible:ring-primary resize-none"
                    placeholder="Add a description..."
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Change the description of the board
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }

  return (
    <div className="space-y-2">
      <h1
        className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors px-2 py-1 rounded hover:bg-accent/50"
        onDoubleClick={() => setIsEditing(true)}
      >
        {board.name}
      </h1>
      <p
        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent/50 min-h-10"
        onDoubleClick={() => setIsEditing(true)}
      >
        {board.description || "Add a description..."}
      </p>
    </div>
  );
};
