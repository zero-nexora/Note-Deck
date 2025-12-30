"use server";

import {
  CreateUserGroupInput,
  CreateUserGroupSchema,
  UpdateUserGroupInput,
  UpdateUserGroupSchema,
  DeleteUserGroupInput,
  DeleteUserGroupSchema,
} from "@/domain/schemas/user-group.schema";
import { userGroupService } from "@/domain/services/user-group.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createUserGroupAction = async (input: CreateUserGroupInput) => {
  try {
    const user = await requireAuth();

    const parsed = CreateUserGroupSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const group = await userGroupService.create(user.id, parsed.data);
    return success("User group created successfully", group);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findUserGroupByIdAction = async (id: string) => {
  try {
    await requireAuth();

    const group = await userGroupService.findById(id);
    return success("", group);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findUserGroupsByWorkspaceAction = async (workspaceId: string) => {
  try {
    await requireAuth();

    const groups = await userGroupService.findByWorkspaceId(workspaceId);
    return success("", groups);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateUserGroupAction = async (
  id: string,
  input: UpdateUserGroupInput
) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateUserGroupSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const group = await userGroupService.update(user.id, id, parsed.data);
    return success("User group updated successfully", group);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteUserGroupAction = async (input: DeleteUserGroupInput) => {
  try {
    const user = await requireAuth();

    const parsed = DeleteUserGroupSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await userGroupService.delete(user.id, parsed.data);
    return success("User group deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
