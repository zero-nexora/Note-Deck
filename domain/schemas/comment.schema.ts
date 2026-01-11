import z from "zod";

export const CreateCommentSchema = z.object({
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }),
  content: z.string().min(1, { message: "Content is required" }),
  parentId: z.string().uuid({ message: "Invalid UUID for parentId" }).optional(),
  mentions: z.array(z.string().uuid()).optional(),
});

export const UpdateCommentSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }).optional(),
  mentions: z.array(z.string().uuid()).optional(),
});

export const DeleteCommentSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
export type DeleteCommentInput = z.infer<typeof DeleteCommentSchema>;
