import { z } from "zod";
import { UpdateUser } from "../types/user.type";

export const UpdateUserSchema: z.ZodType<UpdateUser> = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  image: z.string().nullable().optional(),
});

export const DeleteUserSchema = z.object({
  id: z.string().min(1),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;
