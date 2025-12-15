import { z } from "zod";
import { NewCard, UpdateCard } from "../types/card.type";

export const CreateCardSchema: z.ZodType<NewCard> = z.object({
  listId: z.string(),
  boardId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  position: z.number(),
  dueDate: z.date().nullable().optional(),
  isArchived: z.boolean().optional(),
  coverImage: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UpdateCardSchema: z.ZodType<UpdateCard> = z.object({
  listId: z.string().optional(),
  boardId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  position: z.number().optional(),
  dueDate: z.date().nullable().optional(),
  isArchived: z.boolean().optional(),
  coverImage: z.string().nullable().optional(),
  updatedAt: z.date().optional(),
});

export type CreateCardInput = z.infer<typeof CreateCardSchema>;
export type UpdateCardInput = z.infer<typeof UpdateCardSchema>;
