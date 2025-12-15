import { userRepository } from "../repositories/user.repository";
import {
  UpdateUserInput,
} from "../schemas/user.schema";

export const userService = {
  update: async (data: UpdateUserInput) => {
    return await userRepository.update(data);
  },

  delete: async (id: string) => {
    await userRepository.delete(id);
  },
};
