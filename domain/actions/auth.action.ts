"use server";

import { SignUpInput, SignUpSchema } from "@/domain/schemas/auth.schema";
import { authService } from "@/domain/services/auth.service";
import { error, success } from "@/lib/response";

export const signUpAction = async (input: SignUpInput) => {
  try {
    const parsed = SignUpSchema.safeParse({
      name: input.name,
      email: input.email,
      password: input.password,
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten();

      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";

      return error(message);
    }

    const validatedData: SignUpInput = parsed.data;

    const user = await authService.signUp(validatedData);

    return success("Sign up successfully", user);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
