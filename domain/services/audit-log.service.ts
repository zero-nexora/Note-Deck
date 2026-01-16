import { canUser } from "@/lib/check-permissions";
import {
  LogWorkspaceActionInput,
  ReadAuditLogsInput,
} from "../schemas/audit-log.schema";
import { workspaceRepository } from "../repositories/workspace.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { ROLE } from "@/lib/constants";

const DEFAULT_AUDIT_LOG_LIMIT = 100;
const DEFAULT_PAGE = 1;

export const auditLogService = {
  log: async (userId: string, data: LogWorkspaceActionInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const auditLog = await auditLogRepository.create({
      ...data,
      userId,
    });

    return auditLog;
  },

  read: async (userId: string, data: ReadAuditLogsInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: workspace.id,
      workspaceRole: ROLE.ADMIN,
    });
    if (!allowed) throw new Error("Permission denied");

    const limit = data.limit || DEFAULT_AUDIT_LOG_LIMIT;
    const page = data.page || DEFAULT_PAGE;
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
