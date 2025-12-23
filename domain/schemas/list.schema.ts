import { z } from "zod";

export const CreateListSchema = z.object({
  boardId: z.string(),
  name: z.string(),
  position: z.number(),
});

export const UpdateListSchema = z.object({
  boardId: z.string(),
  name: z.string().optional(),
  position: z.number().optional(),
  isArchived: z.boolean().optional(),
});

export type CreateListInput = z.infer<typeof CreateListSchema>;
export type UpdateListInput = z.infer<typeof UpdateListSchema>;
