"use server";

import {
  UpdateUserInput,
  UpdateUserSchema,
  DeleteUserInput,
  DeleteUserSchema,
} from "@/domain/schemas/user.schema";
import { userService } from "@/domain/services/user.service";
import { requireAuth } from "@/lib/session";
import { success, error } from "@/lib/response";

export const updateUserAction = async (id: string, input: UpdateUserInput) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateUserSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const updated = await userService.update(user.id, id, parsed.data);
    return success("User updated successfully", updated);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteUserAction = async (input: DeleteUserInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteUserSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    await userService.delete(user.id, parsed.data);
    return success("User deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
