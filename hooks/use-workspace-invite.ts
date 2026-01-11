"use client";

import {
  createWorkspaceInviteAction,
  resendWorkspaceInviteAction,
  revokeWorkspaceInviteAction,
  acceptWorkspaceInviteAction,
  expireWorkspaceInviteAction,
} from "@/domain/actions/workspace-invite.action";
import {
  CreateInviteInput,
  ResendInviteInput,
  RevokeInviteInput,
  AcceptInviteInput,
  ExpireInviteInput,
} from "@/domain/schemas/workspace-invite.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useWorkspaceInvite() {
  const router = useRouter();

  const createWorkspaceInvite = async (input: CreateInviteInput) => {
    const result = await createWorkspaceInviteAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  const resendWorkspaceInvite = async (input: ResendInviteInput) => {
    const result = await resendWorkspaceInviteAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  const revokeWorkspaceInvite = async (input: RevokeInviteInput) => {
    const result = await revokeWorkspaceInviteAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  const acceptWorkspaceInvite = async (input: AcceptInviteInput) => {
    const result = await acceptWorkspaceInviteAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  const expireWorkspaceInvite = async (input: ExpireInviteInput) => {
    const result = await expireWorkspaceInviteAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  return {
    createWorkspaceInvite,
    resendWorkspaceInvite,
    revokeWorkspaceInvite,
    acceptWorkspaceInvite,
    expireWorkspaceInvite,
  };
}
