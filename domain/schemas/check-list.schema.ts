import { z } from "zod";

export const CreateChecklistSchema = z.object({
  cardId: z.string().min(1),
  title: z.string().min(1),
});

export const UpdateChecklistSchema = z.object({
  title: z.string().min(1).optional(),
});

export const ReorderChecklistSchema = z.object({
  id: z.string().min(1),
  position: z.number().int().min(0),
});

export const DeleteChecklistSchema = z.object({
  id: z.string().min(1),
});

export type CreateChecklistInput = z.infer<typeof CreateChecklistSchema>;
export type UpdateChecklistInput = z.infer<typeof UpdateChecklistSchema>;
export type ReorderChecklistInput = z.infer<typeof ReorderChecklistSchema>;
export type DeleteChecklistInput = z.infer<typeof DeleteChecklistSchema>;
