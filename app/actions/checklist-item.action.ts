"use server";

import {
  CreateChecklistItemInput,
  CreateChecklistItemSchema,
  DeleteChecklistItemInput,
  DeleteChecklistItemSchema,
  ReorderChecklistItemInput,
  ReorderChecklistItemSchema,
  ToggleChecklistItemInput,
  ToggleChecklistItemSchema,
  UpdateChecklistItemInput,
  UpdateChecklistItemSchema,
} from "@/domain/schemas/check-list-item.schema";
import { checklistItemService } from "@/domain/services/checklist-item.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createChecklistItemAction = async (
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

    const item = await checklistItemService.create(user.id, parsed.data);

    return success("Checklist item created successfully", item);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const toggleChecklistItemAction = async (
  input: ToggleChecklistItemInput
) => {
  try {
    const user = await requireAuth();
    const parsed = ToggleChecklistItemSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const item = await checklistItemService.toggle(user.id, parsed.data);

    return success("Checklist item updated successfully", item);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const reorderChecklistItemAction = async (
  input: ReorderChecklistItemInput
) => {
  try {
    const user = await requireAuth();
    const parsed = ReorderChecklistItemSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const item = await checklistItemService.reorder(user.id, parsed.data);
    return success("Checklist item reordered successfully", item);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateChecklistItemAction = async (
  id: string,
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

    const item = await checklistItemService.update(user.id, id, parsed.data);

    return success("Checklist item updated successfully", item);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteChecklistItemAction = async (
  input: DeleteChecklistItemInput
) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteChecklistItemSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await checklistItemService.delete(user.id, parsed.data);
    return success("Checklist item deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
