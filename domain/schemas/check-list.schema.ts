import { z } from "zod";
import { NewChecklist, UpdateChecklist } from "../types/check-list.type";

export const CreateChecklistSchema: z.ZodType<NewChecklist> = z.object({
  cardId: z.string(),
  title: z.string(),
  position: z.number(),
  createdAt: z.date().optional(),
});

export const UpdateChecklistSchema: z.ZodType<UpdateChecklist> = z.object({
  cardId: z.string().optional(),
  title: z.string().optional(),
  position: z.number().optional(),
  updatedAt: z.date().optional(),
});

export type CreateChecklistInput = z.infer<typeof CreateChecklistSchema>;
export type UpdateChecklistInput = z.infer<typeof UpdateChecklistSchema>;
