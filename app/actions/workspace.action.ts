"use server";

import {
  CreateWorkspaceInput,
  CreateWorkspaceSchema,
  UpdateWorkspaceInput,
  UpdateWorkspaceSchema,
} from "@/domain/schemas/workspace.schema";
import { workspaceService } from "@/domain/services/workspace.service";
import { checkWorkspacePermission } from "@/lib/permissions";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const workspaceActions = {
  create: async (formData: FormData) => {
    try {
      const user = await requireAuth();
      const parsed = CreateWorkspaceSchema.safeParse({
        name: formData.get("name")?.toString(),
        slug: formData.get("slug")?.toString(),
        ownerId: formData.get("ownerId")?.toString(),
        plan: formData.get("plan")?.toString(),
        stripeCustomerId: formData.get("stripeCustomerId")?.toString() ?? null,
        stripeSubscriptionId:
          formData.get("stripeSubscriptionId")?.toString() ?? null,
        subscriptionStatus:
          formData.get("subscriptionStatus")?.toString() ?? null,
        limits: {
          boards: formData.get("boards")
            ? Number(formData.get("boards"))
            : undefined,
          cardsPerBoard: formData.get("cardsPerBoard")
            ? Number(formData.get("cardsPerBoard"))
            : undefined,
          membersPerWorkspace: formData.get("membersPerWorkspace")
            ? Number(formData.get("membersPerWorkspace"))
            : undefined,
        },
      });

      if (!parsed.success) {
        return error("Invalid input", parsed.error.flatten());
      }

      const data: CreateWorkspaceInput = parsed.data;

      const workspace = await workspaceService.create(user.id, data);

      return success("Workspace created successfully", workspace);
    } catch (err: any) {
      return error(err.message, err);
    }
  },

  findById: async (id: string) => {
    try {
      const user = await requireAuth();
      const hasPermission = await checkWorkspacePermission(
        user.id,
        id,
        "observer"
      );

      if (!hasPermission) {
        throw new Error("Permission denied");
      }

      const workspace = await workspaceService.findById(id);

      return success("", workspace);
    } catch (err: any) {
      return error(err.message, err);
    }
  },

  findByUserId: async () => {
    try {
      const user = await requireAuth();
      const workspace = workspaceService.findById(user.id);

      return success("", workspace);
    } catch (err: any) {
      return error(err.message, err);
    }
  },

  update: async (formData: FormData) => {
    try {
      const user = await requireAuth();

      const parsed = UpdateWorkspaceSchema.safeParse({
        name: formData.get("name")?.toString(),
        slug: formData.get("slug")?.toString(),
        ownerId: formData.get("ownerId")?.toString(),
        plan: formData.get("plan")?.toString(),
        stripeCustomerId: formData.get("stripeCustomerId")?.toString() ?? null,
        stripeSubscriptionId:
          formData.get("stripeSubscriptionId")?.toString() ?? null,
        subscriptionStatus:
          formData.get("subscriptionStatus")?.toString() ?? null,
        limits: {
          boards: formData.get("boards")
            ? Number(formData.get("boards"))
            : undefined,
          cardsPerBoard: formData.get("cardsPerBoard")
            ? Number(formData.get("cardsPerBoard"))
            : undefined,
          membersPerWorkspace: formData.get("membersPerWorkspace")
            ? Number(formData.get("membersPerWorkspace"))
            : undefined,
        },
      });

      if (!parsed.success) {
        return error("Invalid input", parsed.error.flatten());
      }

      const data: UpdateWorkspaceInput = parsed.data;

      const workspace = await workspaceService.update(user.id, data);

      return success("Workspace updated successfully", workspace);
    } catch (err: any) {
      return error(err.message, err);
    }
  },
};
