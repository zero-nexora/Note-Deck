"use client";
import {
  addMemberAction,
  removeMemberAction,
  changeMemberRoleAction,
  listMembersAction,
  leaveWorkspaceAction,
} from "@/app/actions/workspace-member.action";
import {
  AddMemberInput,
  RemoveMemberInput,
  ChangeMemberRoleInput,
  ListMembersInput,
  LeaveWorkspaceInput,
} from "@/domain/schemas/workspace-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useWorkspaceMember() {
  const router = useRouter();

  const addMember = async (input: AddMemberInput) => {
    try {
      const result = await addMemberAction(input);
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

  const removeMember = async (input: RemoveMemberInput) => {
    try {
      const result = await removeMemberAction(input);
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

  const changeRole = async (input: ChangeMemberRoleInput) => {
    try {
      const result = await changeMemberRoleAction(input);
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

  const listMembers = async (input: ListMembersInput) => {
    try {
      const result = await listMembersAction(input);
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

  const leaveWorkspace = async (input: LeaveWorkspaceInput) => {
    try {
      const result = await leaveWorkspaceAction(input);
      if (result.success) {
        toast.success(result.message);
        router.push("/workspaces");
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
    changeRole,
    listMembers,
    leaveWorkspace,
  };
}
