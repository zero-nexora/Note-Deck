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
} from "@/domain/schemas/workspace-invite.schema";
import { workspaceInviteService } from "@/domain/services/workspace-invite.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createInviteAction = async (input: CreateInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateInviteSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const invite = await workspaceInviteService.create(user.id, parsed.data);
    return success("Invite created successfully", invite);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const resendInviteAction = async (input: ResendInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = ResendInviteSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const invite = await workspaceInviteService.resend(user.id, parsed.data);
    return success("Invite resent successfully", invite);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const revokeInviteAction = async (input: RevokeInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = RevokeInviteSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await workspaceInviteService.revoke(user.id, parsed.data);
    return success("Invite revoked successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const acceptInviteAction = async (input: AcceptInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = AcceptInviteSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const invite = await workspaceInviteService.accept(user.id, parsed.data);
    return success("Invite accepted successfully", invite);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const expireInviteAction = async (input: ExpireInviteInput) => {
  try {
    const user = await requireAuth();
    const parsed = ExpireInviteSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await workspaceInviteService.expire(user.id, parsed.data);
    return success("Invite expired successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
