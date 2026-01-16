import { STRIPE_PLANS } from "@/lib/stripe";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import { assertOwner, canUser } from "@/lib/check-permissions";
import {
  ChangePlanInput,
  CreateWorkspaceInput,
  DeleteWorkspaceInput,
  FindWorkspaceByIdInput,
  UpdateWorkspaceNameInput,
} from "../schemas/workspace.schema";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository";
import {
  AUDIT_ACTION,
  DEFAULT_PLAN,
  DEFAULT_WORKSPACE_OWNER_ROLE,
  ENTITY_TYPE,
  PERMISSIONS,
  ROLE,
} from "@/lib/constants";

export const workspaceService = {
  create: async (userId: string, data: CreateWorkspaceInput) => {
    const trimmedName = data.name.trim();
    if (!trimmedName) throw new Error("Workspace name cannot be empty");

    const workspace = await workspaceRepository.create({
      name: trimmedName,
      ownerId: userId,
      plan: DEFAULT_PLAN,
      limits: STRIPE_PLANS[DEFAULT_PLAN],
    });

    await workspaceMemberRepository.add({
      workspaceId: workspace.id,
      userId,
      role: DEFAULT_WORKSPACE_OWNER_ROLE,
    });

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: AUDIT_ACTION.WORKSPACE_CREATED,
      entityType: ENTITY_TYPE.WORKSPACE,
      entityId: workspace.id,
      metadata: { name: workspace.name },
    });

    return workspace;
  },

  findById: async (userId: string, data: FindWorkspaceByIdInput) => {
    const workspace = await workspaceRepository.findByIdWithOwnerAndMembers(
      data.workspaceId
    );

    if (!workspace) throw new Error("Workspace not found");

    const allowed = await canUser(userId, {
      workspaceId: workspace.id,
      workspaceRole: ROLE.OBSERVER
    });

    if (!allowed) throw new Error("Permission denied");

    return workspace;
  },

  findByUserId: async (userId: string) => {
    const workspaces =
      await workspaceRepository.findByUserIdWithOwnerAndMembers(userId);

    if (!workspaces?.length) return [];

    return workspaces;
  },

  updateName: async (
    userId: string,
    workspaceId: string,
    data: UpdateWorkspaceNameInput
  ) => {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const allowed = await canUser(userId, {
      workspaceId: workspace.id,
      workspaceRole: ROLE.ADMIN,
      permission: PERMISSIONS.WORKSPACE_UPDATE
    });

    if (!allowed) throw new Error("Permission denied");

    const trimmedName = data.name.trim();
    if (!trimmedName) throw new Error("Workspace name cannot be empty");
    if (workspace.name === trimmedName) return workspace;

    const updatedWorkspace = await workspaceRepository.update(workspace.id, {
      name: trimmedName,
    });

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: AUDIT_ACTION.WORKSPACE_NAME_UPDATED,
      entityType: ENTITY_TYPE.WORKSPACE,
      entityId: workspace.id,
      metadata: { oldName: workspace.name, newName: trimmedName },
    });

    return updatedWorkspace;
  },

  changePlan: async (
    userId: string,
    workspaceId: string,
    data: ChangePlanInput
  ) => {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    await assertOwner(userId, workspaceId);

    const planLimits = STRIPE_PLANS[data.plan];
    if (!planLimits) throw new Error("Invalid plan");
    if (workspace.plan === data.plan) return workspace;

    const updatedWorkspace = await workspaceRepository.update(workspace.id, {
      plan: data.plan,
      limits: planLimits,
    });

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: AUDIT_ACTION.WORKSPACE_PLAN_CHANGE,
      entityType: ENTITY_TYPE.WORKSPACE,
      entityId: workspace.id,
      metadata: {
        oldPlan: workspace.plan,
        newPlan: data.plan,
        oldLimits: workspace.limits,
        newLimits: planLimits,
      },
    });

    return updatedWorkspace;
  },

  delete: async (userId: string, data: DeleteWorkspaceInput) => {
    const workspace = await workspaceRepository.findById(data.id);
    if (!workspace) throw new Error("Workspace not found");

    await assertOwner(userId, data.id);

    if (workspace.ownerId !== userId) {
      throw new Error("Only the workspace owner can delete it");
    }

    await auditLogRepository.create({
      workspaceId: workspace.id,
      userId,
      action: AUDIT_ACTION.WORKSPACE_DELETED,
      entityType: ENTITY_TYPE.WORKSPACE,
      entityId: workspace.id,
      metadata: {
        name: workspace.name,
        plan: workspace.plan,
      },
    });

    await workspaceRepository.delete(data.id);
  },
};
