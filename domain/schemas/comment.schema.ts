import { z } from "zod";
import { NewComment, UpdateComment } from "../types/comment.type";

export const CreateCommentSchema: z.ZodType<NewComment> = z.object({
  cardId: z.string(),
  userId: z.string(),
  parentId: z.string().nullable().optional(),
  content: z.string(),
  mentions: z.array(z.string()).optional().default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UpdateCommentSchema: z.ZodType<UpdateComment> = z.object({
  cardId: z.string().optional(),
  userId: z.string().optional(),
  parentId: z.string().nullable().optional(),
  content: z.string().optional(),
  mentions: z.array(z.string()).optional(),
  updatedAt: z.date().optional(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
