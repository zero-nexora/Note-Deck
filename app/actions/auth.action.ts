"use server";

import {
  SignInSchema,
  SignUpInput,
  SignUpSchema,
} from "@/domain/schemas/auth.schema";
import { authService } from "@/domain/services/auth.service";
import { error, success } from "@/lib/response";

export const authAction = {
  signUp: async (formData: FormData) => {
    try {
      const parsed = SignUpSchema.safeParse({
        name: formData.get("name")?.toString(),
        email: formData.get("email")?.toString(),
        password: formData.get("password")?.toString(),
      });

      if (!parsed.success) {
        return error("Invalid input", parsed.error.flatten());
      }

      const data: SignUpInput = parsed.data;

      const user = await authService.signUp(data);

      return success("Sign up successfully", user);
    } catch (err: any) {
      return error(err.message, err);
    }
  },

  signIn: async (formData: FormData) => {
    try {
      const parsed = SignInSchema.safeParse({
        email: formData.get("email")?.toString(),
        password: formData.get("password")?.toString(),
      });

      if (!parsed.success) {
        return error("Invalid input", parsed.error.flatten());
      }

      const user = await authService.signIn(parsed.data);

      return success("Sign in successfully", user);
    } catch (err: any) {
      return error(err.message, err);
    }
  },
};
