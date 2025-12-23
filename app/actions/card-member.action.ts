"use server";

import {
  CreateCardMemberInput,
  CreateCardMemberSchema,
} from "@/domain/schemas/card-member.schema";
import { cardMemberService } from "@/domain/services/card-member.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const addCardMemberAction = async (
  boardId: string,
  input: CreateCardMemberInput
) => {
  try {
    const user = await requireAuth();

    const parsed = CreateCardMemberSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const member = await cardMemberService.add(user.id, boardId, parsed.data);

    return success("Member added to card successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const removeCardMemberAction = async (
  boardId: string,
  cardId: string,
  memberUserId: string
) => {
  try {
    const user = await requireAuth();

    await cardMemberService.remove(user.id, boardId, cardId, memberUserId);

    return success("Member removed from card successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
