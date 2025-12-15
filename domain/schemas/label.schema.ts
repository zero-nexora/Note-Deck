import { z } from "zod";
import { NewLabel, UpdateLabel } from "../types/label.type";

export const CreateLabelSchema: z.ZodType<NewLabel> = z.object({
  boardId: z.string(),
  name: z.string(),
  color: z.string(),
  createdAt: z.date().optional(),
});

export const UpdateLabelSchema: z.ZodType<UpdateLabel> = z.object({
  boardId: z.string().optional(),
  name: z.string().optional(),
  color: z.string().optional(),
  updatedAt: z.date().optional(),
});

export type CreateLabelInput = z.infer<typeof CreateLabelSchema>;
export type UpdateLabelInput = z.infer<typeof UpdateLabelSchema>;
