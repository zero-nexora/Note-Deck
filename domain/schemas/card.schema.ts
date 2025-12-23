import { z } from "zod";

export const CreateCardSchema = z.object({
  boardId: z.string(),
  listId: z.string(),
  title: z.string(),
  position: z.number(),
});

export const UpdateCardSchema = z.object({
  listId: z.string(),
  boardId: z.string(),
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  position: z.number().optional(),
  dueDate: z.date().nullable().optional(),
  isArchived: z.boolean().optional(),
  coverImage: z.string().nullable().optional(),
});

export type CreateCardInput = z.infer<typeof CreateCardSchema>;
export type UpdateCardInput = z.infer<typeof UpdateCardSchema>;
