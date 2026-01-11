"use server";

import {
  AddCommentReactionInput,
  AddCommentReactionSchema,
  RemoveCommentReactionInput,
  RemoveCommentReactionSchema,
} from "@/domain/schemas/comment-reaction.schema";
import { commentReactionService } from "@/domain/services/comment-reaction.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const addCommentReactionAction = async (
  input: AddCommentReactionInput
) => {
  try {
    const user = await requireAuth();
    const parsed = AddCommentReactionSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const reaction = await commentReactionService.add(user.id, parsed.data);
    return success("Reaction added successfully", reaction);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const removeCommentReactionAction = async (
  input: RemoveCommentReactionInput
) => {
  try {
    const user = await requireAuth();
    const parsed = RemoveCommentReactionSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await commentReactionService.remove(user.id, parsed.data);
    return success("Reaction removed successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
