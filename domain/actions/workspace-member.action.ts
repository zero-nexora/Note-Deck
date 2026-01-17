"use server";

import {
  AddMemberInput,
  AddMemberSchema,
  RemoveMemberInput,
  RemoveMemberSchema,
  ChangeMemberRoleInput,
  ChangeMemberRoleSchema,
  ListMembersInput,
  ListMembersSchema,
  LeaveWorkspaceInput,
  LeaveWorkspaceSchema,
  TransferOwnershipInput,
  TransferOwnershipSchema,
} from "@/domain/schemas/workspace-member.schema";
import { workspaceMemberService } from "@/domain/services/workspace-member.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const addWorkspaceMemberAction = async (input: AddMemberInput) => {
  try {
    const user = await requireAuth();
    const parsed = AddMemberSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const member = await workspaceMemberService.add(user.id, parsed.data);
    return success("Member added successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const removeWorkspaceMemberAction = async (input: RemoveMemberInput) => {
  try {
    const user = await requireAuth();
    const parsed = RemoveMemberSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    await workspaceMemberService.remove(user.id, parsed.data);
    return success("Member removed successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const changeWorkspaceMemberRoleAction = async (
  input: ChangeMemberRoleInput
) => {
  try {
    const user = await requireAuth();
    const parsed = ChangeMemberRoleSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const member = await workspaceMemberService.changeRole(
      user.id,
      parsed.data
    );
    return success("Role changed successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const listWorkspaceMembersAction = async (input: ListMembersInput) => {
  try {
    const user = await requireAuth();
    const parsed = ListMembersSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const members = await workspaceMemberService.list(user.id, parsed.data);
    
    return success("", members);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const leaveWorkspaceAction = async (input: LeaveWorkspaceInput) => {
  try {
    const user = await requireAuth();
    const parsed = LeaveWorkspaceSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    await workspaceMemberService.leave(user.id, parsed.data);
    return success("You have left the workspace");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const transferWorkspaceOwnershipAction = async (
  input: TransferOwnershipInput
) => {
  try {
    const user = await requireAuth();
    const parsed = TransferOwnershipSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    await workspaceMemberService.transferOwnership(user.id, parsed.data);
    return success("Workspace ownership transferred successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
