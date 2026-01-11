import z from "zod";

export const CreateChecklistSchema = z.object({
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }),
  title: z.string().min(1, { message: "Title is required" }),
});

export const UpdateChecklistSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
});

export const DeleteChecklistSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const ReorderChecklistSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
  position: z.number().int(),
});

export type CreateChecklistInput = z.infer<typeof CreateChecklistSchema>;
export type UpdateChecklistInput = z.infer<typeof UpdateChecklistSchema>;
export type DeleteChecklistInput = z.infer<typeof DeleteChecklistSchema>;
export type ReorderChecklistInput = z.infer<typeof ReorderChecklistSchema>;
