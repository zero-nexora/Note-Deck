import { hashPassword } from "@/lib/bcrypt";
import { userRepository } from "../repositories/user.repository";
import { SignUpInput } from "../schemas/auth.schema";

export const authService = {
  signUp: async (data: SignUpInput) => {
    const normalizedEmail = data.email.toLowerCase().trim();

    const exists = await userRepository.findByEmail(normalizedEmail);
    if (exists) {
      throw new Error("Email already exists");
    }

    const trimmedName = data.name?.trim();
    if (trimmedName && trimmedName.length === 0) {
      throw new Error("Name cannot be empty");
    }

    let hashedPassword = "";
    if (data.password) {
      const trimmedPassword = data.password.trim();
      if (trimmedPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      hashedPassword = await hashPassword(trimmedPassword);
    }

    const user = await userRepository.create({
      ...data,
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return user;
  },
};
