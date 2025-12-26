import { z } from "zod";

export const CreateCardSchema = z.object({
  listId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  coverImage: z.string().url().optional(),
});

export const UpdateCardSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  coverImage: z.string().url().optional(),
});

export const MoveCardSchema = z.object({
  id: z.string().min(1),
  listId: z.string().min(1),
  position: z.number().int().min(0),
});

export const ReorderCardSchema = z.object({
  id: z.string().min(1),
  position: z.number().int().min(0),
});

export const ArchiveCardSchema = z.object({
  id: z.string().min(1),
});

export const RestoreCardSchema = z.object({
  id: z.string().min(1),
});

export const DeleteCardSchema = z.object({
  id: z.string().min(1),
});

export type CreateCardInput = z.infer<typeof CreateCardSchema>;
export type UpdateCardInput = z.infer<typeof UpdateCardSchema>;
export type MoveCardInput = z.infer<typeof MoveCardSchema>;
export type ReorderCardInput = z.infer<typeof ReorderCardSchema>;
export type ArchiveCardInput = z.infer<typeof ArchiveCardSchema>;
export type RestoreCardInput = z.infer<typeof RestoreCardSchema>;
export type DeleteCardInput = z.infer<typeof DeleteCardSchema>;
