"use client";

import {
  addWorkspaceMemberAction,
  removeWorkspaceMemberAction,
  changeWorkspaceMemberRoleAction,
  leaveWorkspaceAction,
  transferWorkspaceOwnershipAction,
} from "@/domain/actions/workspace-member.action";
import {
  AddMemberInput,
  RemoveMemberInput,
  ChangeMemberRoleInput,
  LeaveWorkspaceInput,
  TransferOwnershipInput,
} from "@/domain/schemas/workspace-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useWorkspaceMember() {
  const router = useRouter();

  const addWorkspaceMember = async (input: AddMemberInput) => {
    const result = await addWorkspaceMemberAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  const removeWorkspaceMember = async (input: RemoveMemberInput) => {
    const result = await removeWorkspaceMemberAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  const changeWorkspaceMemberRole = async (input: ChangeMemberRoleInput) => {
    const result = await changeWorkspaceMemberRoleAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const leaveWorkspace = async (input: LeaveWorkspaceInput) => {
    const result = await leaveWorkspaceAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.push("/workspaces");
    router.refresh();
  };

  const transferWorkspaceOwnership = async (input: TransferOwnershipInput) => {
    const result = await transferWorkspaceOwnershipAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    addWorkspaceMember,
    removeWorkspaceMember,
    changeWorkspaceMemberRole,
    leaveWorkspace,
    transferWorkspaceOwnership,
  };
}
