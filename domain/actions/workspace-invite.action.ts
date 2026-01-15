"use server";

import {
  CreateInviteInput,
  CreateInviteSchema,
  ResendInviteInput,
  ResendInviteSchema,
  RevokeInviteInput,
  RevokeInviteSchema,
  AcceptInviteInput,
  AcceptInviteSchema,
  ExpireInviteInput,
  ExpireInviteSchema,
  ListPendingInvitesInput,
  ListPendingInvitesSchema,
} from "@/domain/schemas/workspace-invite.schema";
import { workspaceInviteService } from "@/domain/services/workspace-invite.service";
import { requireAuth } from "@/lib/session";
import { success, error } from "@/lib/response";

export const createWorkspaceInviteAction = async (input: CreateInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateInviteSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const invite = await workspaceInviteService.create(user.id, parsed.data);
    return success("Invite created successfully", invite);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const listPendingWorkspaceInvitesAction = async (
  input: ListPendingInvitesInput
) => {
  try {
    const user = await requireAuth();

    const parsed = ListPendingInvitesSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const invites = await workspaceInviteService.listPendingInvites(
      user.id,
      parsed.data
    );

    return success("Pending invites fetched successfully", invites);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const resendWorkspaceInviteAction = async (input: ResendInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = ResendInviteSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const invite = await workspaceInviteService.resend(user.id, parsed.data);
    return success("Invite resent successfully", invite);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const revokeWorkspaceInviteAction = async (input: RevokeInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = RevokeInviteSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await workspaceInviteService.revoke(user.id, parsed.data);
    return success("Invite revoked successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const acceptWorkspaceInviteAction = async (input: AcceptInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = AcceptInviteSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const invite = await workspaceInviteService.accept(user.id, parsed.data);
    return success("Invite accepted successfully", invite);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const expireWorkspaceInviteAction = async (input: ExpireInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = ExpireInviteSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const invite = await workspaceInviteService.expire(user.id, parsed.data);
    return success("Invite expired successfully", invite);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
