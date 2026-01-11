import { hashPassword } from "@/lib/bcrypt";
import { userRepository } from "../repositories/user.repository";
import { SignUpInput } from "../schemas/auth.schema";

const MIN_PASSWORD_LENGTH = 8;

export const authService = {
  signUp: async (data: SignUpInput) => {
    const normalizedEmail = data.email.toLowerCase().trim();

    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const trimmedName = data.name?.trim();
    if (trimmedName !== undefined && !trimmedName) {
      throw new Error("Name cannot be empty");
    }

    let hashedPassword = "";
    if (data.password) {
      const trimmedPassword = data.password.trim();
      if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
        throw new Error(
          `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
        );
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
