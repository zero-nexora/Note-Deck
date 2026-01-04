import { STRIPE_PLANS } from "@/lib/stripe";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import slugify from "slugify";
import { checkWorkspacePermission } from "@/lib/check-permissions";
import {
  ChangePlanInput,
  CreateWorkspaceInput,
  DeleteWorkspaceInput,
  UpdateWorkspaceNameInput,
  UpdateWorkspaceSlugInput,
} from "../schemas/workspace.schema";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository";

export const workspaceService = {
  create: async (userId: string, data: CreateWorkspaceInput) => {
    const trimmedName = data.name.trim();

    if (!trimmedName) {
      throw new Error("Workspace name cannot be empty");
    }

    const slug = await generateUniqueSlug(trimmedName);

    const workspace = await workspaceRepository.create({
      name: trimmedName,
      slug,
      ownerId: userId,
      plan: "free",
      limits: STRIPE_PLANS["free"],
    });

    await workspaceMemberRepository.add({
      workspaceId: workspace.id,
      userId,
      role: "admin",
    });

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: "workspace.created",
      entityType: "workspace",
      entityId: workspace.id,
      metadata: { name: workspace.name, slug: workspace.slug },
    });

    return workspace;
  },

  findById: async (userId: string, id: string) => {
    const workspace = await workspaceRepository.findById(id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      id,
      "observer"
    );

    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    return workspace;
  },

  findByUserId: async (userId: string) => {
    const workspaces = await workspaceRepository.findByUserId(userId);

    if (!workspaces || workspaces.length === 0) {
      return [];
    }

    const result = [];

    for (const ws of workspaces) {
      const allowed = await checkWorkspacePermission(userId, ws.id, "observer");
      if (allowed) {
        result.push(ws);
      }
    }

    return result;
  },

  updateName: async (
    userId: string,
    id: string,
    data: UpdateWorkspaceNameInput
  ) => {
    const workspace = await workspaceRepository.findById(id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(userId, id, "admin");

    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedName = data.name.trim();

    if (!trimmedName) {
      throw new Error("Workspace name cannot be empty");
    }

    if (workspace.name === trimmedName) {
      return workspace;
    }

    const updated = await workspaceRepository.update(id, { name: trimmedName });

    await auditLogRepository.create({
      workspaceId: id,
      userId,
      action: "workspace.name_updated",
      entityType: "workspace",
      entityId: id,
      metadata: { oldName: workspace.name, newName: trimmedName },
    });

    return updated;
  },

  updateSlug: async (
    userId: string,
    id: string,
    data: UpdateWorkspaceSlugInput
  ) => {
    const workspace = await workspaceRepository.findById(id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(userId, id, "admin");

    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const normalizedSlug = slugify(data.slug, { lower: true, strict: true });

    if (!normalizedSlug) {
      throw new Error("Invalid slug format");
    }

    if (workspace.slug === normalizedSlug) {
      return workspace;
    }

    const exists = await workspaceRepository.findBySlug(normalizedSlug);

    if (exists && exists.id !== id) {
      throw new Error("Slug already taken");
    }

    const updated = await workspaceRepository.update(id, {
      slug: normalizedSlug,
    });

    await auditLogRepository.create({
      workspaceId: id,
      userId,
      action: "workspace.slug_updated",
      entityType: "workspace",
      entityId: id,
      metadata: { oldSlug: workspace.slug, newSlug: normalizedSlug },
    });

    return updated;
  },

  changePlan: async (userId: string, id: string, data: ChangePlanInput) => {
    const workspace = await workspaceRepository.findById(id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(userId, id, "admin");

    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const planLimits = STRIPE_PLANS[data.plan];

    if (!planLimits) {
      throw new Error("Invalid plan");
    }

    if (workspace.plan === data.plan) {
      return workspace;
    }

    const updated = await workspaceRepository.update(id, {
      plan: data.plan,
      limits: planLimits,
    });

    await auditLogRepository.create({
      workspaceId: id,
      userId,
      action: "workspace.plan_changed",
      entityType: "workspace",
      entityId: id,
      metadata: {
        oldPlan: workspace.plan,
        newPlan: data.plan,
        oldLimits: workspace.limits,
        newLimits: planLimits,
      },
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteWorkspaceInput) => {
    const workspace = await workspaceRepository.findById(data.id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.id,
      "admin"
    );

    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    if (workspace.ownerId !== userId) {
      throw new Error("Only the workspace owner can delete it");
    }

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: "workspace.deleted",
      entityType: "workspace",
      entityId: workspace.id,
      metadata: {
        name: workspace.name,
        slug: workspace.slug,
        plan: workspace.plan,
      },
    });

    await workspaceRepository.delete(data.id);
  },
};

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await workspaceRepository.findBySlug(slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}
