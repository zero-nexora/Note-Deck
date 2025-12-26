"use client";
import { updateUserAction, deleteUserAction } from "@/app/actions/user.action";
import { UpdateUserInput, DeleteUserInput } from "@/domain/schemas/user.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUser() {
  const router = useRouter();

  const updateUser = async (id: string, input: UpdateUserInput) => {
    try {
      const result = await updateUserAction(id, input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteUser = async (input: DeleteUserInput) => {
    try {
      const result = await deleteUserAction(input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    updateUser,
    deleteUser,
  };
}
