"use client";

import {
  addUserGroupMemberAction,
  removeUserGroupMemberAction,
} from "@/app/actions/user-group-member.action";
import {
  AddGroupMemberInput,
  RemoveGroupMemberInput,
} from "@/domain/schemas/user-group-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUserGroupMember() {
  const router = useRouter();

  const addMember = async (input: AddGroupMemberInput) => {
    try {
      const result = await addUserGroupMemberAction(input);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data;
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error: any) {
      toast.error(error.message);
      return null;
    }
  };

  const removeMember = async (input: RemoveGroupMemberInput) => {
    try {
      const result = await removeUserGroupMemberAction(input);

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
    addMember,
    removeMember,
  };
}
