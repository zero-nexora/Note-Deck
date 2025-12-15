import { auditLogRepository } from "../repositories/audit.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "../schemas/workspace.schema";

export const workspaceService = {
  create: async (userId: string, data: CreateWorkspaceInput) => {
    const workspace = await workspaceRepository.create(data);

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

  findById: async (id: string) => {
    return await workspaceRepository.findById(id);
  },

  findByUserId: async (ownerId: string) => {
    return await workspaceRepository.findByUserId(ownerId);
  },

  update: async (userId: string, data: UpdateWorkspaceInput) => {
    const updated = await workspaceRepository.update(data);

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
};
