"use client";

import {
  addBoardMemberAction,
  removeBoardMemberAction,
  changeBoardMemberRoleAction,
} from "@/domain/actions/board-member.action";
import {
  AddBoardMemberInput,
  RemoveBoardMemberInput,
  ChangeBoardMemberRoleInput,
} from "@/domain/schemas/board-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useBoardMember() {
  const router = useRouter();

  const addBoardMember = async (input: AddBoardMemberInput) => {
    const result = await addBoardMemberAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const removeBoardMember = async (input: RemoveBoardMemberInput) => {
    const result = await removeBoardMemberAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return true;
  };

  const changeBoardMemberRole = async (input: ChangeBoardMemberRoleInput) => {
    const result = await changeBoardMemberRoleAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  return {
    addBoardMember,
    removeBoardMember,
    changeBoardMemberRole,
  };
}
