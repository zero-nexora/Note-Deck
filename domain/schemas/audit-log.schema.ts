import { z } from "zod";
import { JsonValue } from "./common.schem";

export const LogWorkspaceActionSchema = z.object({
  workspaceId: z.string().min(1),
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  metadata: JsonValue.optional().default({}),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export const ReadAuditLogsSchema = z.object({
  workspaceId: z.string().min(1),
  limit: z.number().int().positive().optional().default(100),
  userId: z.string().optional(),
});

export type LogWorkspaceActionInput = z.infer<typeof LogWorkspaceActionSchema>;
export type ReadAuditLogsInput = z.infer<typeof ReadAuditLogsSchema>;
