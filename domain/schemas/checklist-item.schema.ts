import z from "zod";

export const CreateChecklistItemSchema = z.object({
  checklistId: z.string().uuid({ message: "Invalid UUID for checklistId" }),
  text: z.string().min(1, { message: "Text is required" }),
});

export const UpdateChecklistItemSchema = z.object({
  text: z.string().min(1, { message: "Text is required" }).optional(),
});

export const ToggleChecklistItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
  isCompleted: z.boolean(),
});

export const DeleteChecklistItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const ReorderChecklistItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
  position: z.number().int(),
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
export type DeleteChecklistItemInput = z.infer<
  typeof DeleteChecklistItemSchema
>;
export type ReorderChecklistItemInput = z.infer<
  typeof ReorderChecklistItemSchema
>;
