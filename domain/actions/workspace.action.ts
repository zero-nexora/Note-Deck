"use server";

import {
  ChangePlanInput,
  ChangePlanSchema,
  CreateWorkspaceInput,
  CreateWorkspaceSchema,
  DeleteWorkspaceInput,
  DeleteWorkspaceSchema,
  FindWorkspaceByIdInput,
  FindWorkspaceByIdSchema,
  UpdateWorkspaceNameInput,
  UpdateWorkspaceNameSchema,
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
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const workspace = await workspaceService.create(user.id, parsed.data);
    return success("Workspace created successfully", workspace);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findWorkspaceByIdAction = async (
  input: FindWorkspaceByIdInput
) => {
  try {
    const user = await requireAuth();
    const parsed = FindWorkspaceByIdSchema.safeParse(input);
    if (!parsed.success) return error("Invalid workspace id");
    const workspace = await workspaceService.findById(user.id, parsed.data);
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

export const updateWorkspaceNameAction = async (
  workspaceId: string,
  input: UpdateWorkspaceNameInput
) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateWorkspaceNameSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const workspace = await workspaceService.updateName(
      user.id,
      workspaceId,
      parsed.data
    );
    return success("Workspace name updated successfully", workspace);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const changeWorkspacePlanAction = async (
  workspaceId: string,
  input: ChangePlanInput
) => {
  try {
    const user = await requireAuth();
    const parsed = ChangePlanSchema.safeParse(input);
    if (!parsed.success) return error("Invalid plan");
    const workspace = await workspaceService.changePlan(
      user.id,
      workspaceId,
      parsed.data
    );
    return success("Workspace plan changed successfully", workspace);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteWorkspaceAction = async (input: DeleteWorkspaceInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteWorkspaceSchema.safeParse(input);
    if (!parsed.success) return error("Invalid workspace id");
    await workspaceService.delete(user.id, parsed.data);
    return success("Workspace deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
