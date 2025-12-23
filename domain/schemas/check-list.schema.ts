import { z } from "zod";

export const CreateChecklistSchema = z.object({
  cardId: z.string(),
  title: z.string(),
  position: z.number(),
});

export const UpdateChecklistSchema = z.object({
  cardId: z.string(),
  title: z.string().optional(),
  position: z.number().optional(),
});

export type CreateChecklistInput = z.infer<typeof CreateChecklistSchema>;
export type UpdateChecklistInput = z.infer<typeof UpdateChecklistSchema>;
