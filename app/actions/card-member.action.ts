"use server";
import {
  AddCardMemberInput,
  AddCardMemberSchema,
  RemoveCardMemberInput,
  RemoveCardMemberSchema,
} from "@/domain/schemas/card-member.schema";
import { cardMemberService } from "@/domain/services/card-member.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const addCardMemberAction = async (input: AddCardMemberInput) => {
  try {
    const user = await requireAuth();
    const parsed = AddCardMemberSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const member = await cardMemberService.add(user.id, parsed.data);
    return success("Member added successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const removeCardMemberAction = async (input: RemoveCardMemberInput) => {
  try {
    const user = await requireAuth();
    const parsed = RemoveCardMemberSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await cardMemberService.remove(user.id, parsed.data);
    return success("Member removed successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
