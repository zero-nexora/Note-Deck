import { hashPassword } from "@/lib/bcrypt";
import { userRepository } from "../repositories/user.repository";
import { DeleteUserInput, UpdateUserInput } from "../schemas/user.schema";

export const userService = {
  update: async (
    userId: string,
    targetUserId: string,
    data: UpdateUserInput
  ) => {
    if (userId !== targetUserId) {
      throw new Error("Permission denied");
    }

    const user = await userRepository.findById(targetUserId);
    if (!user) {
      throw new Error("User not found");
    }

    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        throw new Error("Name cannot be empty");
      }
    }

    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await hashPassword(data.password);
    }

    const updatedUser = await userRepository.update(targetUserId, {
      email: data.email,
      name: data.name,
      image: data.image,
      password: hashedPassword,
    });

    return updatedUser;
  },

  delete: async (userId: string, data: DeleteUserInput) => {
    if (userId !== data.id) {
      throw new Error("Permission denied");
    }

    const user = await userRepository.findById(data.id);
    if (!user) {
      throw new Error("User not found");
    }

    await userRepository.delete(data.id);
  },
};
