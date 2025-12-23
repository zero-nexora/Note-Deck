import { z } from "zod";

export const CreateActivitySchema = z.object({
  boardId: z.string(),
  cardId: z.string().nullable().optional(),
  userId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.date().optional(),
});

export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
