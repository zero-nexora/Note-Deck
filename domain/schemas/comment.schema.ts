import { z } from "zod";

export const CreateCommentSchema = z.object({
  cardId: z.string().min(1),
  content: z.string().min(1),
  parentId: z.string().optional(),
  mentions: z.array(z.string()).optional(),
});

export const UpdateCommentSchema = z.object({
  content: z.string().min(1).optional(),
  mentions: z.array(z.string()).optional(),
});

export const DeleteCommentSchema = z.object({
  id: z.string().min(1),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
export type DeleteCommentInput = z.infer<typeof DeleteCommentSchema>;