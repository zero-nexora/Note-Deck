import { checkWorkspacePermission } from "@/lib/check-permissions";
import {
  LogWorkspaceActionInput,
  ReadAuditLogsInput,
} from "../schemas/audit-log.schema";
import { workspaceRepository } from "../repositories/workspace.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";

export const auditLogService = {
  log: async (userId: string, data: LogWorkspaceActionInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const log = await auditLogRepository.create({
      ...data,
      userId,
    });

    return log;
  },

  read: async (userId: string, data: ReadAuditLogsInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const limit = data.limit || 100;
    const page = data.page || 1;
    const offset = (page - 1) * limit;

    if (data.userId) {
      const { logs, total } = await auditLogRepository.findByUserId(
        data.workspaceId,
        data.userId,
        limit,
        offset
      );

      return {
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    }

    const { logs, total } = await auditLogRepository.findByWorkspaceId(
      data.workspaceId,
      limit,
      offset
    );

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  },
};
