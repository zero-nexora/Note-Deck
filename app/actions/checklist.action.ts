"use server";

import {
  CreateChecklistSchema,
  UpdateChecklistSchema,
  CreateChecklistInput,
  UpdateChecklistInput,
} from "@/domain/schemas/check-list.schema";
import { checklistService } from "@/domain/services/checklist.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createChecklistAction = async (
  boardId: string,
  input: CreateChecklistInput
) => {
  try {
    const user = await requireAuth();

    const parsed = CreateChecklistSchema.safeParse(input);
    if (!parsed.success) {
      const msg =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(msg);
    }

    const checklist = await checklistService.create(
      user.id,
      boardId,
      parsed.data
    );

    return success("Checklist created successfully", checklist);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findChecklistByIdAction = async (id: string) => {
  try {
    const user = await requireAuth();

    const checklist = await checklistService.findById(user.id, id);

    return success("", checklist);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findChecklistsByCardIdAction = async (cardId: string) => {
  try {
    const user = await requireAuth();

    const checklists = await checklistService.findByCardId(user.id, cardId);

    return success("", checklists);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateChecklistAction = async (
  boardId: string,
  id: string,
  input: UpdateChecklistInput
) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateChecklistSchema.safeParse(input);
    if (!parsed.success) {
      const msg =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(msg);
    }

    const checklist = await checklistService.update(
      user.id,
      boardId,
      id,
      parsed.data
    );

    return success("Checklist updated successfully", checklist);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const moveChecklistAction = async (input: {
  boardId: string;
  checklistId: string;
  position: number;
}) => {
  try {
    const user = await requireAuth();

    const checklist = await checklistService.move(
      user.id,
      input.boardId,
      input.checklistId,
      input.position
    );

    return success("Checklist moved successfully", checklist);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteChecklistAction = async (boardId: string, id: string) => {
  try {
    const user = await requireAuth();

    await checklistService.delete(user.id, boardId, id);

    return success("Checklist deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
