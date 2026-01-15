"use client";

import {
  addUserGroupMemberAction,
  removeUserGroupMemberAction,
} from "@/domain/actions/user-group-member.action";
import {
  AddGroupMemberInput,
  RemoveGroupMemberInput,
} from "@/domain/schemas/user-group-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUserGroupMember() {
  const router = useRouter();

  const addUserGroupMember = async (input: AddGroupMemberInput) => {
    const result = await addUserGroupMemberAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const removeUserGroupMember = async (input: RemoveGroupMemberInput) => {
    const result = await removeUserGroupMemberAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    addUserGroupMember,
    removeUserGroupMember,
  };
}
