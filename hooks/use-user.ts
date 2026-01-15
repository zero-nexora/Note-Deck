"use client";

import {
  updateUserAction,
  deleteUserAction,
} from "@/domain/actions/user.action";
import { UpdateUserInput, DeleteUserInput } from "@/domain/schemas/user.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUser() {
  const router = useRouter();

  const updateUser = async (id: string, input: UpdateUserInput) => {
    const result = await updateUserAction(id, input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }

    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const deleteUser = async (input: DeleteUserInput) => {
    const result = await deleteUserAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }

    toast.success(result.message);
    router.refresh();
  };

  return {
    updateUser,
    deleteUser,
  };
}
