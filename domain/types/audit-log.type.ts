import { auditLogs } from "@/db/schema";
import { auditLogService } from "../services/audit-log.service";

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type AuditLogWithUserWorkspacePagination = Awaited<
  ReturnType<typeof auditLogService.read>
>;
