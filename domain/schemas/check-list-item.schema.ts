import { z } from "zod";

export const CreateChecklistItemSchema = z.object({
  checklistId: z.string().min(1),
  text: z.string().min(1),
});

export const UpdateChecklistItemSchema = z.object({
  text: z.string().min(1).optional(),
});

export const ToggleChecklistItemSchema = z.object({
  id: z.string().min(1),
  isCompleted: z.boolean(),
});

export const ReorderChecklistItemSchema = z.object({
  id: z.string().min(1),
  position: z.number().int().min(0),
});

export const DeleteChecklistItemSchema = z.object({
  id: z.string().min(1),
});

export type CreateChecklistItemInput = z.infer<
  typeof CreateChecklistItemSchema
>;
export type UpdateChecklistItemInput = z.infer<
  typeof UpdateChecklistItemSchema
>;
export type ToggleChecklistItemInput = z.infer<
  typeof ToggleChecklistItemSchema
>;
export type ReorderChecklistItemInput = z.infer<
  typeof ReorderChecklistItemSchema
>;
export type DeleteChecklistItemInput = z.infer<
  typeof DeleteChecklistItemSchema
>;
