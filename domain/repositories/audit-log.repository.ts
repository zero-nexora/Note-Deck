import { db } from "@/db";
import { NewAuditLog } from "../types/audit-log.type";
import { auditLogs } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const auditLogRepository = {
  create: async (data: NewAuditLog) => {
    const [log] = await db
      .insert(auditLogs)
      .values({ ...data, metadata: data.metadata ?? {} })
      .returning();
    return log;
  },

  findByWorkspaceId: async (workspaceId: string, limit = 100) => {
    const logs = await db.query.auditLogs.findMany({
      where: eq(auditLogs.workspaceId, workspaceId),
      with: {
        user: true,
      },
      orderBy: [desc(auditLogs.createdAt)],
      limit,
    });
    return logs;
  },

  findByUserId: async (workspaceId: string, userId: string, limit = 50) => {
    const logs = await db.query.auditLogs.findMany({
      where: and(
        eq(auditLogs.workspaceId, workspaceId),
        eq(auditLogs.userId, userId)
      ),
      with: {
        user: true,
      },
      orderBy: [desc(auditLogs.createdAt)],
      limit,
    });
    return logs;
  },
};
