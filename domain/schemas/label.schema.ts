import { z } from "zod";

export const CreateLabelSchema = z.object({
  boardId: z.string(),
  name: z.string(),
  color: z.string(),
});

export const UpdateLabelSchema = z.object({
  boardId: z.string(),
  name: z.string().optional(),
  color: z.string().optional(),
});

export type CreateLabelInput = z.infer<typeof CreateLabelSchema>;
export type UpdateLabelInput = z.infer<typeof UpdateLabelSchema>;
