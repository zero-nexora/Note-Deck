"use server";

import {
  CreateChecklistItemInput,
  CreateChecklistItemSchema,
  UpdateChecklistItemInput,
  UpdateChecklistItemSchema,
} from "@/domain/schemas/check-list-item.schema";
import { checklistItemService } from "@/domain/services/checklist-item.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createChecklistItemAction = async (
  boardId: string,
  input: CreateChecklistItemInput
) => {
  try {
    const user = await requireAuth();

    const parsed = CreateChecklistItemSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const item = await checklistItemService.create(
      user.id,
      boardId,
      parsed.data
    );

    return success("Checklist item created successfully", item);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const toggleChecklistItemAction = async (
  boardId: string,
  itemId: string,
  isCompleted: boolean
) => {
  try {
    const user = await requireAuth();

    const item = await checklistItemService.toggle(
      user.id,
      boardId,
      itemId,
      isCompleted
    );

    return success("Checklist item updated successfully", item);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateChecklistItemAction = async (
  boardId: string,
  itemId: string,
  input: UpdateChecklistItemInput
) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateChecklistItemSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const updated = await checklistItemService.update(
      user.id,
      boardId,
      itemId,
      parsed.data
    );

    return success("Checklist item updated successfully", updated);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteChecklistItemAction = async (
  boardId: string,
  itemId: string
) => {
  try {
    const user = await requireAuth();

    await checklistItemService.delete(user.id, boardId, itemId);

    return success("Checklist item deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
