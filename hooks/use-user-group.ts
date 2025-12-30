"use client";

import {
  createUserGroupAction,
  updateUserGroupAction,
  deleteUserGroupAction,
} from "@/app/actions/user-group.action";
import {
  CreateUserGroupInput,
  UpdateUserGroupInput,
  DeleteUserGroupInput,
} from "@/domain/schemas/user-group.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUserGroup() {
  const router = useRouter();

  const createUserGroup = async (input: CreateUserGroupInput) => {
    try {
      const result = await createUserGroupAction(input);

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

  const updateUserGroup = async (id: string, input: UpdateUserGroupInput) => {
    try {
      const result = await updateUserGroupAction(id, input);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteUserGroup = async (input: DeleteUserGroupInput) => {
    try {
      const result = await deleteUserGroupAction(input);

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
    createUserGroup,
    updateUserGroup,
    deleteUserGroup,
  };
}
