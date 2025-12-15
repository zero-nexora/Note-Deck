import { db } from "@/db";
import { NewAuditLog } from "../types/audit-log.type";
import { auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export const auditLogRepository = {
  create: async (data: NewAuditLog) => {
    const [auditLog] = await db.insert(auditLogs).values(data).returning();

    return auditLog;
  },

  findByWorkspaceId: async (workspaceId: string, limit = 100) => {
    return await db.query.auditLogs.findMany({
      where: eq(auditLogs.workspaceId, workspaceId),
      with: {
        user: true,
      },
      orderBy: (auditLogs, { desc }) => [desc(auditLogs.createdAt)],
      limit,
    });
  },
};
