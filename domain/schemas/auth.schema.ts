import { z } from "zod";
import { NewUser } from "../types/user.type";

export const SignUpSchema: z.ZodType<NewUser> = z.object({
  email: z.string().email(),
  name: z.string(),
  image: z.string().nullable().optional(),
  password: z.string().min(6),
  emailVerified: z.date().nullable().optional(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
