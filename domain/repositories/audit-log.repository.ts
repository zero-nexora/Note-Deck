import { db } from "@/db";
import { NewAuditLog } from "../types/audit-log.type";
import { auditLogs } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

export const auditLogRepository = {
  create: async (data: NewAuditLog) => {
    const [log] = await db
      .insert(auditLogs)
      .values({ ...data, metadata: data.metadata ?? {} })
      .returning();
    return log;
  },

  findByWorkspaceId: async (workspaceId: string, limit = 100, offset = 0) => {
    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspaceId));

    const total = Number(totalResult[0]?.count || 0);

    // Get paginated logs
    const logs = await db.query.auditLogs.findMany({
      where: eq(auditLogs.workspaceId, workspaceId),
      with: {
        user: true,
        workspace: true,
      },
      orderBy: [desc(auditLogs.createdAt)],
      limit,
      offset,
    });

    return { logs, total };
  },

  findByUserId: async (
    workspaceId: string,
    userId: string,
    limit = 50,
    offset = 0
  ) => {
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.workspaceId, workspaceId),
          eq(auditLogs.userId, userId)
        )
      );

    const total = Number(totalResult[0]?.count || 0);

    const logs = await db.query.auditLogs.findMany({
      where: and(
        eq(auditLogs.workspaceId, workspaceId),
        eq(auditLogs.userId, userId)
      ),
      with: {
        user: true,
        workspace: true,
      },
      orderBy: [desc(auditLogs.createdAt)],
      limit,
      offset,
    });

    return { logs, total };
  },
};
