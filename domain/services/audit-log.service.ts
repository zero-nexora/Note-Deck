import { checkWorkspacePermission } from "@/lib/permissions";
import {
  LogWorkspaceActionInput,
  ReadAuditLogsInput,
} from "../schemas/audit-log.schema";
import { auditLogRepository } from "../repositories/audit-log.repository";

export const auditLogService = {
  log: async (userId: string, data: LogWorkspaceActionInput) => {
    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const log = await auditLogRepository.create({
      ...data,
      userId,
    });

    return log;
  },

  read: async (userId: string, data: ReadAuditLogsInput) => {
    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (data.userId) {
      const logs = await auditLogRepository.findByUserId(
        data.workspaceId,
        data.userId,
        data.limit
      );
      return logs;
    }

    const logs = await auditLogRepository.findByWorkspaceId(
      data.workspaceId,
      data.limit
    );
    return logs;
  },
};
