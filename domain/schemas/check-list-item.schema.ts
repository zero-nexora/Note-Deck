import { z } from "zod";

export const CreateChecklistItemSchema = z.object({
  checklistId: z.string(),
  text: z.string(),
  position: z.number(),
});

export const UpdateChecklistItemSchema = z.object({
  checklistId: z.string(),
  text: z.string().optional(),
  isCompleted: z.boolean().optional(),
  position: z.number().optional(),
});

export type CreateChecklistItemInput = z.infer<
  typeof CreateChecklistItemSchema
>;
export type UpdateChecklistItemInput = z.infer<
  typeof UpdateChecklistItemSchema
>;
