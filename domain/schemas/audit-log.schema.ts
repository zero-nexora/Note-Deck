import z from "zod";

export const LogWorkspaceActionSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  action: z.string().min(1, { message: "Action is required" }),
  entityType: z.string().min(1, { message: "Entity type is required" }),
  entityId: z.string().min(1, { message: "Entity ID is required" }),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const ReadAuditLogsSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }).optional(),
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
});

export type LogWorkspaceActionInput = z.infer<typeof LogWorkspaceActionSchema>;
export type ReadAuditLogsInput = z.infer<typeof ReadAuditLogsSchema>;
