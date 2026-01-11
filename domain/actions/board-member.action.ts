"use server";

import {
  AddBoardMemberInput,
  AddBoardMemberSchema,
  RemoveBoardMemberInput,
  RemoveBoardMemberSchema,
  ChangeBoardMemberRoleInput,
  ChangeBoardMemberRoleSchema,
  ListBoardMembersInput,
  ListBoardMembersSchema,
} from "@/domain/schemas/board-member.schema";
import { boardMemberService } from "@/domain/services/board-member.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const addBoardMemberAction = async (input: AddBoardMemberInput) => {
  try {
    const user = await requireAuth();
    const parsed = AddBoardMemberSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const member = await boardMemberService.add(user.id, parsed.data);
    return success("Member added successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const removeBoardMemberAction = async (
  input: RemoveBoardMemberInput
) => {
  try {
    const user = await requireAuth();
    const parsed = RemoveBoardMemberSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await boardMemberService.remove(user.id, parsed.data);
    return success("Member removed successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const changeBoardMemberRoleAction = async (
  input: ChangeBoardMemberRoleInput
) => {
  try {
    const user = await requireAuth();
    const parsed = ChangeBoardMemberRoleSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const member = await boardMemberService.changeRole(user.id, parsed.data);
    return success("Role changed successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const listBoardMembersAction = async (input: ListBoardMembersInput) => {
  try {
    const user = await requireAuth();
    const parsed = ListBoardMembersSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const members = await boardMemberService.list(user.id, parsed.data);
    return success("", members);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};