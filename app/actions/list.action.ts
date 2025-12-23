"use server";

import {
  CreateListInput,
  CreateListSchema,
  UpdateListInput,
  UpdateListSchema,
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

export const updateListAction = async (
  listId: string,
  input: UpdateListInput
) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateListSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const list = await listService.update(user.id, listId, parsed.data);

    return success("List updated successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const moveListAction = async (input: {
  id: string;
  position: number;
}) => {
  try {
    const user = await requireAuth();

    const list = await listService.move(user.id, input);

    return success("List moved successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const archiveListAction = async (listId: string) => {
  try {
    const user = await requireAuth();

    const list = await listService.archive(user.id, listId);

    return success("List archived successfully", list);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteListAction = async (listId: string) => {
  try {
    const user = await requireAuth();

    await listService.delete(user.id, listId);

    return success("List deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
