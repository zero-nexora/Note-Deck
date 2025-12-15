import { z } from "zod";
import { NewAuditLog } from "../types/audit-log.type";

export const CreateAuditLogSchema: z.ZodType<NewAuditLog> = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.date().optional(),
});

export type CreateAuditLogInput = z.infer<typeof CreateAuditLogSchema>;
