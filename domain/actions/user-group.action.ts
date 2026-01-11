"use server";

import {
  CreateUserGroupInput,
  CreateUserGroupSchema,
  FindUserGroupInput,
  FindUserGroupSchema,
  FindUserGroupsByWorkspaceInput,
  FindUserGroupsByWorkspaceSchema,
  UpdateUserGroupInput,
  UpdateUserGroupSchema,
  DeleteUserGroupInput,
  DeleteUserGroupSchema,
} from "@/domain/schemas/user-group.schema";
import { userGroupService } from "@/domain/services/user-group.service";
import { requireAuth } from "@/lib/session";
import { success, error } from "@/lib/response";

export const createUserGroupAction = async (input: CreateUserGroupInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateUserGroupSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const group = await userGroupService.create(user.id, parsed.data);
    return success("User group created successfully", group);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findUserGroupByIdAction = async (input: FindUserGroupInput) => {
  try {
    const user = await requireAuth();
    const parsed = FindUserGroupSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const group = await userGroupService.findById(user.id, parsed.data);
    return success("", group);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findUserGroupsByWorkspaceIdAction = async (
  input: FindUserGroupsByWorkspaceInput
) => {
  try {
    const user = await requireAuth();
    const parsed = FindUserGroupsByWorkspaceSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const groups = await userGroupService.findByWorkspaceId(
      user.id,
      parsed.data
    );
    return success("", groups);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateUserGroupAction = async (
  groupId: string,
  input: UpdateUserGroupInput
) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateUserGroupSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    const group = await userGroupService.update(user.id, groupId, parsed.data);
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
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }

    await userGroupService.delete(user.id, parsed.data);
    return success("User group deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
