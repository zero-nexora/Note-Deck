import z from "zod";

export const AddCommentReactionSchema = z.object({
  commentId: z.string().uuid({ message: "Invalid UUID for commentId" }),
  emoji: z.string().min(1, { message: "Emoji is required" }),
});

export const RemoveCommentReactionSchema = z.object({
  commentId: z.string().uuid({ message: "Invalid UUID for commentId" }),
  emoji: z.string().min(1, { message: "Emoji is required" }),
});

export type AddCommentReactionInput = z.infer<typeof AddCommentReactionSchema>;
export type RemoveCommentReactionInput = z.infer<
  typeof RemoveCommentReactionSchema
>;
