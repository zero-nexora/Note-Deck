"use server";

import {
  CreateCommentInput,
  CreateCommentSchema,
  UpdateCommentInput,
  UpdateCommentSchema,
  DeleteCommentInput,
  DeleteCommentSchema,
} from "@/domain/schemas/comment.schema";
import { commentService } from "@/domain/services/comment.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createCommentAction = async (input: CreateCommentInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateCommentSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const comment = await commentService.create(user.id, parsed.data);
    return success("Comment created successfully", comment);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateCommentAction = async (
  id: string,
  input: UpdateCommentInput
) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateCommentSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const comment = await commentService.update(user.id, id, parsed.data);
    return success("Comment updated successfully", comment);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteCommentAction = async (input: DeleteCommentInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteCommentSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await commentService.delete(user.id, parsed.data);
    return success("Comment deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
