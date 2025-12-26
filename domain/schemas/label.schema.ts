import { z } from "zod";

export const CreateLabelSchema = z.object({
  boardId: z.string().min(1),
  name: z.string().min(1),
  color: z.string().min(1),
});

export const UpdateLabelSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
});

export const DeleteLabelSchema = z.object({
  id: z.string().min(1),
});

export type CreateLabelInput = z.infer<typeof CreateLabelSchema>;
export type UpdateLabelInput = z.infer<typeof UpdateLabelSchema>;
export type DeleteLabelInput = z.infer<typeof DeleteLabelSchema>;
