import { userRepository } from "../repositories/user.repository";
import { SignUpInput } from "../schemas/auth.schema";

export const authService = {
  signUp: async (data: SignUpInput) => {
    const existing = await userRepository.findByEmail(data.email!);
    if (existing) throw new Error("User with this email already exists");
    return await userRepository.create(data);
  },
};
