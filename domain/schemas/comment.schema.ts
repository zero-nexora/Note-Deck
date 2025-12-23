import { z } from "zod";

export const CreateCommentSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
  parentId: z.string().nullable().optional(),
  content: z.string(),
  mentions: z.array(z.string()).optional().default([]),
});

export const UpdateCommentSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
  parentId: z.string().nullable().optional(),
  content: z.string().optional(),
  mentions: z.array(z.string()).optional(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
