import { STRIPE_PLANS } from "@/lib/stripe";
import { auditLogRepository } from "../repositories/audit.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "../schemas/workspace.schema";
import slugify from "slugify";
import { checkWorkspacePermission } from "@/lib/permissions";

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

  update: async (userId: string, id: string, data: UpdateWorkspaceInput) => {
    const workspace = await workspaceRepository.findById(id);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(userId, id, "admin");

    if (!hasPermission) throw new Error("Permission denied");

    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("Workspace name cannot be empty");
    }

    const updated = await workspaceRepository.update(id, data);

    await auditLogRepository.create({
      workspaceId: updated.id,
      userId,
      action: "workspace.updated",
      entityType: "workspace",
      entityId: updated.id,
      metadata: data,
    });

    return updated;
  },

  async delete(userId: string, id: string) {
    const workspace = await workspaceRepository.findById(id);
    if (!workspace) throw new Error("Workspace not found");

    const allowed = await checkWorkspacePermission(userId, id, "admin");
    if (!allowed) throw new Error("Permission denied");

    await workspaceRepository.delete(id);

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
