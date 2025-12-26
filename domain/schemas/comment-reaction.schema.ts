import { z } from "zod";

export const AddCommentReactionSchema = z.object({
  commentId: z.string().min(1),
  emoji: z.string().min(1).max(10),
});

export const RemoveCommentReactionSchema = z.object({
  commentId: z.string().min(1),
  emoji: z.string().min(1).max(10),
});

export type AddCommentReactionInput = z.infer<typeof AddCommentReactionSchema>;
export type RemoveCommentReactionInput = z.infer<
  typeof RemoveCommentReactionSchema
>;