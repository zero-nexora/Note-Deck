"use server";

import {
  CreateCommentInput,
  CreateCommentSchema,
  UpdateCommentInput,
  UpdateCommentSchema,
} from "@/domain/schemas/comment.schema";
import { commentService } from "@/domain/services/comment.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createCommentAction = async (
  boardId: string,
  input: CreateCommentInput
) => {
  try {
    const user = await requireAuth();

    const parsed = CreateCommentSchema.safeParse({
      ...input,
      userId: user.id,
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const comment = await commentService.create(user.id, boardId, parsed.data);

    return success("Comment created successfully", comment);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findCommentsByCardIdAction = async (cardId: string) => {
  try {
    const user = await requireAuth();

    const comments = await commentService.findByCardId(user.id, cardId);

    return success("", comments);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findCommentByIdAction = async (id: string) => {
  try {
    const user = await requireAuth();

    const comment = await commentService.findById(user.id, id);

    return success("", comment);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateCommentAction = async (
  boardId: string,
  id: string,
  input: UpdateCommentInput
) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateCommentSchema.safeParse({
      ...input,
      userId: user.id,
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const updated = await commentService.update(
      user.id,
      boardId,
      id,
      parsed.data
    );

    return success("Comment updated successfully", updated);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteCommentAction = async (
  boardId: string,
  commentId: string
) => {
  try {
    const user = await requireAuth();

    await commentService.delete(user.id, boardId, commentId);

    return success("Comment deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
