"use client";

import {
  createUserGroupAction,
  updateUserGroupAction,
  deleteUserGroupAction,
} from "@/domain/actions/user-group.action";
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
    const result = await createUserGroupAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  const updateUserGroup = async (
    groupId: string,
    input: UpdateUserGroupInput
  ) => {
    const result = await updateUserGroupAction(groupId, input);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const deleteUserGroup = async (input: DeleteUserGroupInput) => {
    const result = await deleteUserGroupAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  return {
    createUserGroup,
    updateUserGroup,
    deleteUserGroup,
  };
}
