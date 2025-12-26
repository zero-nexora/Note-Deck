import { hashPassword } from "@/lib/bcrypt";
import { userRepository } from "../repositories/user.repository";
import {
  DeleteUserInput,
  UpdateUserInput,
} from "../schemas/user.schema";

export const userService = {
  update: async (userId: string, id: string, data: UpdateUserInput) => {
    if (userId !== id) throw new Error("Permission denied");

    const user = await userRepository.findById(id);
    if (!user) throw new Error("User not found");

    if (data.name && data.name.trim() === "") {
      throw new Error("Name cannot be empty");
    }

    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await hashPassword(data.password);
    }

    const updated = await userRepository.update(id, {
      name: data.name,
      image: data.image,
      password: hashedPassword,
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteUserInput) => {
    if (userId !== data.id) throw new Error("Permission denied");

    const user = await userRepository.findById(data.id);
    if (!user) throw new Error("User not found");

    await userRepository.delete(data.id);
  },
};
