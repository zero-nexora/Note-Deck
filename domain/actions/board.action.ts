"use server";

import {
  CreateBoardInput,
  CreateBoardSchema,
  UpdateBoardInput,
  UpdateBoardSchema,
  ArchiveBoardInput,
  ArchiveBoardSchema,
  RestoreBoardInput,
  RestoreBoardSchema,
  DeleteBoardInput,
  DeleteBoardSchema,
} from "@/domain/schemas/board.schema";
import { boardService } from "@/domain/services/board.service";
import { requireAuth } from "@/lib/session";
import { success, error } from "@/lib/response";

export const createBoardAction = async (input: CreateBoardInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateBoardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
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
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const board = await boardService.update(user.id, boardId, parsed.data);
    return success("Board updated successfully", board);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const archiveBoardAction = async (input: ArchiveBoardInput) => {
  try {
    const user = await requireAuth();
    const parsed = ArchiveBoardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const board = await boardService.archive(user.id, parsed.data);
    return success("Board archived successfully", board);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const restoreBoardAction = async (input: RestoreBoardInput) => {
  try {
    const user = await requireAuth();
    const parsed = RestoreBoardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const board = await boardService.restore(user.id, parsed.data);
    return success("Board restored successfully", board);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteBoardAction = async (input: DeleteBoardInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteBoardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await boardService.delete(user.id, parsed.data);
    return success("Board deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
