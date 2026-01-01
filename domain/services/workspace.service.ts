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
    const slug = await generateUniqueSlug(data.name);

    const workspace = await workspaceRepository.create({
      name: data.name.trim(),
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
      metadata: { name: workspace.name },
    });

    return workspace;
  },

  findById: async (userId: string, id: string) => {
    const workspace = await workspaceRepository.findById(id);

    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      id,
      "observer"
    );

    if (!hasPermission) throw new Error("Permission denied");

    return workspace;
  },

  findByUserId: async (userId: string) => {
    const workspaces = await workspaceRepository.findByUserId(userId);
    if (!workspaces || workspaces.length === 0)
      throw new Error("Workspace not found");

    const result = [];

    for (const ws of workspaces) {
      const allowed = await checkWorkspacePermission(userId, ws.id, "observer");
      if (allowed) result.push(ws);
    }

    if (result.length === 0) throw new Error("Permission denied");

    return result;
  },

  updateName: async (
    userId: string,
    id: string,
    data: UpdateWorkspaceNameInput
  ) => {
    const workspace = await workspaceRepository.findById(id);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(userId, id, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    if (data.name.trim() === "") {
      throw new Error("Workspace name cannot be empty");
    }

    const updated = await workspaceRepository.update(id, { name: data.name });

    await auditLogRepository.create({
      workspaceId: id,
      userId,
      action: "workspace.name_updated",
      entityType: "workspace",
      entityId: id,
      metadata: { oldName: workspace.name, newName: data.name },
    });

    return updated;
  },

  updateSlug: async (
    userId: string,
    id: string,
    data: UpdateWorkspaceSlugInput
  ) => {
    const workspace = await workspaceRepository.findById(id);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(userId, id, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await workspaceRepository.findBySlug(data.slug);
    if (exists && exists.id !== id) {
      throw new Error("Slug already taken");
    }

    const updated = await workspaceRepository.update(id, { slug: data.slug });

    await auditLogRepository.create({
      workspaceId: id,
      userId,
      action: "workspace.slug_updated",
      entityType: "workspace",
      entityId: id,
      metadata: { oldSlug: workspace.slug, newSlug: data.slug },
    });

    return updated;
  },

  changePlan: async (userId: string, id: string, data: ChangePlanInput) => {
    const workspace = await workspaceRepository.findById(id);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(userId, id, "admin");
    if (!hasPermission) throw new Error("Permission denied");

    const planLimits = STRIPE_PLANS[data.plan];
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
      metadata: { oldPlan: workspace.plan, newPlan: data.plan },
    });

    return updated;
  },

  delete: async (userId: string, data: DeleteWorkspaceInput) => {
    const workspace = await workspaceRepository.findById(data.id);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.id,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (workspace.ownerId !== userId) {
      throw new Error("Only the workspace owner can delete it");
    }

    await workspaceRepository.delete(data.id);

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: "workspace.deleted",
      entityType: "workspace",
      entityId: workspace.id,
      metadata: { name: workspace.name },
    });
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
