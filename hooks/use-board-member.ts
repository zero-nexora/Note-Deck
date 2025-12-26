"use client";
import {
  addBoardMemberAction,
  removeBoardMemberAction,
  changeBoardMemberRoleAction,
  listBoardMembersAction,
} from "@/app/actions/board-member.action";
import {
  AddBoardMemberInput,
  RemoveBoardMemberInput,
  ChangeBoardMemberRoleInput,
  ListBoardMembersInput,
} from "@/domain/schemas/board-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useBoardMember() {
  const router = useRouter();

  const addMember = async (input: AddBoardMemberInput) => {
    try {
      const result = await addBoardMemberAction(input);
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

  const removeMember = async (input: RemoveBoardMemberInput) => {
    try {
      const result = await removeBoardMemberAction(input);
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

  const changeRole = async (input: ChangeBoardMemberRoleInput) => {
    try {
      const result = await changeBoardMemberRoleAction(input);
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

  const listMembers = async (input: ListBoardMembersInput) => {
    try {
      const result = await listBoardMembersAction(input);
      if (result.success) {
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

  return {
    addMember,
    removeMember,
    changeRole,
    listMembers,
  };
}
