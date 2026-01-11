import z from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  image: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters" })
    .optional(),
});

export const DeleteUserSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;
