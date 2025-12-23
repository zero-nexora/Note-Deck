import { z } from "zod";

export const CreateCommentReactionSchema =
  z.object({
    commentId: z.string(),
    userId: z.string(),
    emoji: z.string(),
  });

export type CreateCommentReactionInput = z.infer<
  typeof CreateCommentReactionSchema
>;
