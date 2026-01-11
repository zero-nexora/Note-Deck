"use server";

import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";
import {
  AddCardMemberInput,
  AddCardMemberSchema,
  RemoveCardMemberInput,
  RemoveCardMemberSchema,
} from "@/domain/schemas/card-member.schema";
import { cardMemberService } from "@/domain/services/card-member.service";

export const addCardMemberAction = async (input: AddCardMemberInput) => {
  try {
    const user = await requireAuth();

    const parsed = AddCardMemberSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const result = await cardMemberService.add(user.id, parsed.data);
    return success("Add card member success", result);
  } catch (err: any) {
    return error(err.message ?? "Add card member failed");
  }
};

export const removeCardMemberAction = async (input: RemoveCardMemberInput) => {
  try {
    const user = await requireAuth();

    const parsed = RemoveCardMemberSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await cardMemberService.remove(user.id, parsed.data);
    return success("Remove card member success");
  } catch (err: any) {
    return error(err.message ?? "Remove card member failed");
  }
};
