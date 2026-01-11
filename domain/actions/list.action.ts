"use server";

import {
  CreateListInput,
  CreateListSchema,
  UpdateListInput,
  UpdateListSchema,
  ArchiveListInput,
  ArchiveListSchema,
  RestoreListInput,
  RestoreListSchema,
  DeleteListInput,
  DeleteListSchema,
  ReorderListsInput,
  ReorderListsSchema,
  DuplicateListInput,
  DuplicateListSchema,
} from "@/domain/schemas/list.schema";
import { listService } from "@/domain/services/list.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createListAction = async (input: CreateListInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateListSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const list = await listService.create(user.id, parsed.data);
    return success("List created successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateListAction = async (
  listId: string,
  input: UpdateListInput
) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateListSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const list = await listService.update(user.id, listId, parsed.data);
    return success("List updated successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const reorderListsAction = async (input: ReorderListsInput) => {
  try {
    const user = await requireAuth();
    const parsed = ReorderListsSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await listService.reorders(user.id, parsed.data);
    return success("Lists reordered successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const archiveListAction = async (input: ArchiveListInput) => {
  try {
    const user = await requireAuth();
    const parsed = ArchiveListSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const list = await listService.archive(user.id, parsed.data);
    return success("List archived successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const restoreListAction = async (input: RestoreListInput) => {
  try {
    const user = await requireAuth();
    const parsed = RestoreListSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const list = await listService.restore(user.id, parsed.data);
    return success("List restored successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteListAction = async (input: DeleteListInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteListSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await listService.delete(user.id, parsed.data);
    return success("List deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const duplicateListAction = async (
  input: DuplicateListInput
) => {
  try {
    const user = await requireAuth();
    const parsed = DuplicateListSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const list = await listService.duplicate(user.id, parsed.data);
    return success("List duplicated successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
