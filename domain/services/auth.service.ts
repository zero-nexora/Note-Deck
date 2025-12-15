import { verifyPassword } from "@/lib/bcrypt";
import { userRepository } from "../repositories/user.repository";
import { SignInInput, SignUpInput } from "../schemas/auth.schema";

export const authService = {
  signUp: async (data: SignUpInput) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error("User with this email already exists");
    return await userRepository.create(data);
  },

  signIn: async (data: SignInInput) => {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Email does not exist");
    }

    if (!user.password) {
      throw new Error("This account does not support password login");
    }

    const isValid = await verifyPassword(data.password, user.password);

    if (!isValid) {
      throw new Error("Incorrect password");
    }

    return user;
  },
};
