"use server";

import {
  CreateChecklistInput,
  CreateChecklistSchema,
  UpdateChecklistInput,
  UpdateChecklistSchema,
  ReorderChecklistInput,
  ReorderChecklistSchema,
  DeleteChecklistInput,
  DeleteChecklistSchema,
} from "@/domain/schemas/checklist.schema";
import { checklistService } from "@/domain/services/checklist.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createChecklistAction = async (input: CreateChecklistInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateChecklistSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const checklist = await checklistService.create(user.id, parsed.data);
    return success("Checklist created successfully", checklist);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateChecklistAction = async (
  id: string,
  input: UpdateChecklistInput
) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateChecklistSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const checklist = await checklistService.update(user.id, id, parsed.data);
    return success("Checklist updated successfully", checklist);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const reorderChecklistAction = async (input: ReorderChecklistInput) => {
  try {
    const user = await requireAuth();
    const parsed = ReorderChecklistSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const checklist = await checklistService.reorder(user.id, parsed.data);
    return success("Checklist reordered successfully", checklist);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteChecklistAction = async (input: DeleteChecklistInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteChecklistSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await checklistService.delete(user.id, parsed.data);
    return success("Checklist deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
