"use server";

import {
  AddGroupMemberInput,
  AddGroupMemberSchema,
  RemoveGroupMemberInput,
  RemoveGroupMemberSchema,
} from "@/domain/schemas/user-group-member.schema";
import { userGroupMemberService } from "@/domain/services/user-group-member.service";
import { requireAuth } from "@/lib/session";
import { success, error } from "@/lib/response";

export const addUserGroupMemberAction = async (input: AddGroupMemberInput) => {
  try {
    const user = await requireAuth();
    const parsed = AddGroupMemberSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const member = await userGroupMemberService.add(user.id, parsed.data);
    return success("Member added to group successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const removeUserGroupMemberAction = async (
  input: RemoveGroupMemberInput
) => {
  try {
    const user = await requireAuth();
    const parsed = RemoveGroupMemberSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await userGroupMemberService.remove(user.id, parsed.data);
    return success("Member removed from group successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
