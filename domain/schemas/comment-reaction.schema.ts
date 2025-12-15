import { z } from "zod";
import { NewCommentReaction } from "../types/comment-reaction.type";

export const CreateCommentReactionSchema: z.ZodType<NewCommentReaction> = z.object({
  commentId: z.string(),
  userId: z.string(),
  emoji: z.string(),
  createdAt: z.date().optional(),
});

export type CreateCommentReactionInput = z.infer<typeof CreateCommentReactionSchema>;
