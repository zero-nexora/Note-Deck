import z from "zod";

export const CreateLabelSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  name: z.string().min(1, { message: "Name is required" }),
  color: z.string().min(1, { message: "Color is required" }),
});

export const UpdateLabelSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  color: z.string().optional(),
});

export const DeleteLabelSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type CreateLabelInput = z.infer<typeof CreateLabelSchema>;
export type UpdateLabelInput = z.infer<typeof UpdateLabelSchema>;
export type DeleteLabelInput = z.infer<typeof DeleteLabelSchema>;
