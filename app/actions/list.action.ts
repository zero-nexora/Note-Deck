"use server";

import {
  CreateListInput,
  CreateListSchema,
  UpdateListInput,
  UpdateListSchema,
  ReorderListInput,
  ReorderListSchema,
  MoveListInput,
  MoveListSchema,
  ArchiveListInput,
  ArchiveListSchema,
  RestoreListInput,
  RestoreListSchema,
  DeleteListInput,
  DeleteListSchema,
} from "@/domain/schemas/list.schema";
import { listService } from "@/domain/services/list.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createListAction = async (input: CreateListInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateListSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const list = await listService.create(user.id, parsed.data);
    return success("List created successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateListAction = async (id: string, input: UpdateListInput) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateListSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const list = await listService.update(user.id, id, parsed.data);
    return success("List updated successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const reorderListAction = async (input: ReorderListInput) => {
  try {
    const user = await requireAuth();
    const parsed = ReorderListSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const list = await listService.reorder(user.id, parsed.data);
    return success("List reordered successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const moveListAction = async (input: MoveListInput) => {
  try {
    const user = await requireAuth();
    const parsed = MoveListSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const list = await listService.move(user.id, parsed.data);
    return success("List moved successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const archiveListAction = async (input: ArchiveListInput) => {
  try {
    const user = await requireAuth();
    const parsed = ArchiveListSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
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
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
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
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await listService.delete(user.id, parsed.data);
    return success("List deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};