"use server";

import {
  CreateWorkspaceInput,
  CreateWorkspaceSchema,
  UpdateWorkspaceInput,
  UpdateWorkspaceSchema,
} from "@/domain/schemas/workspace.schema";
import { workspaceService } from "@/domain/services/workspace.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createWorkspaceAction = async (input: CreateWorkspaceInput) => {
  try {
    const user = await requireAuth();

    const parsed = CreateWorkspaceSchema.safeParse({
      name: input.name,
      ownerId: user.id,
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten();

      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";

      return error(message);
    }

    const validatedData: CreateWorkspaceInput = parsed.data;

    const workspace = await workspaceService.create(user.id, validatedData);

    return success("Workspace created successfully", workspace);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findWorkspaceByIdAction = async (id: string) => {
  try {
    const user = await requireAuth();

    const workspace = await workspaceService.findById(user.id, id);

    return success("", workspace);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findWorkspacesByUserAction = async () => {
  try {
    const user = await requireAuth();

    const workspaces = await workspaceService.findByUserId(user.id);

    return success("", workspaces);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateWorkspaceAction = async (
  id: string,
  input: UpdateWorkspaceInput
) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateWorkspaceSchema.safeParse({
      name: input.name?.toString(),
      plan: input.plan,
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten();

      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";

      return error(message);
    }

    const validatedData: UpdateWorkspaceInput = parsed.data;

    const workspace = await workspaceService.update(user.id, id, validatedData);

    return success("Workspace updated successfully", workspace);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
