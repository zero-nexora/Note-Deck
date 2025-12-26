"use client";
import {
  createInviteAction,
  resendInviteAction,
  revokeInviteAction,
  acceptInviteAction,
  expireInviteAction,
} from "@/app/actions/workspace-invite.action";
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

  const createInvite = async (input: CreateInviteInput) => {
    try {
      const result = await createInviteAction(input);
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

  const resendInvite = async (input: ResendInviteInput) => {
    try {
      const result = await resendInviteAction(input);
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

  const revokeInvite = async (input: RevokeInviteInput) => {
    try {
      const result = await revokeInviteAction(input);
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

  const acceptInvite = async (input: AcceptInviteInput) => {
    try {
      const result = await acceptInviteAction(input);
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

  const expireInvite = async (input: ExpireInviteInput) => {
    try {
      const result = await expireInviteAction(input);
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
    createInvite,
    resendInvite,
    revokeInvite,
    acceptInvite,
    expireInvite,
  };
}
