"use server";

import {
  CreateBoardInput,
  CreateBoardSchema,
  UpdateBoardInput,
  UpdateBoardSchema,
} from "@/domain/schemas/borad.schema";
import { boardService } from "@/domain/services/board.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createBoardAction = async (input: CreateBoardInput) => {
  try {
    const user = await requireAuth();

    const parsed = CreateBoardSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const board = await boardService.create(user.id, parsed.data);

    return success("Board created successfully", board);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findBoardByIdAction = async (boardId: string) => {
  try {
    const user = await requireAuth();

    const board = await boardService.findById(user.id, boardId);

    return success("", board);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findBoardsByWorkspaceIdAction = async (workspaceId: string) => {
  try {
    const user = await requireAuth();

    const boards = await boardService.findByWorkspaceId(user.id, workspaceId);

    return success("", boards);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateBoardAction = async (
  boardId: string,
  input: UpdateBoardInput
) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateBoardSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const board = await boardService.update(user.id, boardId, parsed.data);

    return success("Board updated successfully", board);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteBoardAction = async (boardId: string) => {
  try {
    const user = await requireAuth();

    await boardService.delete(user.id, boardId);

    return success("Board deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
