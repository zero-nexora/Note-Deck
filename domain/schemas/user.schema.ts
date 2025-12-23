import { z } from "zod";
import { UpdateUser } from "../types/user.type";

export const UpdateUserSchema: z.ZodType<UpdateUser> = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  image: z.string().nullable().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
