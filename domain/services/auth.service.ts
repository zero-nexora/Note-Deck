import { hashPassword } from "@/lib/bcrypt";
import { userRepository } from "../repositories/user.repository";
import { SignUpInput } from "../schemas/auth.schema";

export const authService = {
  signUp: async (data: SignUpInput) => {
    const exists = await userRepository.findByEmail(data.email);
    if (exists) throw new Error("Email already exists");

    let hashedPassword = "";
    if (data.password) {
      hashedPassword = await hashPassword(data.password);
    }

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  },
};
