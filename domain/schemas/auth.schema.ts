import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6),
});
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;