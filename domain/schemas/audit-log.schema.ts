import { z } from "zod";

export const CreateAuditLogSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type CreateAuditLogInput = z.infer<typeof CreateAuditLogSchema>;
