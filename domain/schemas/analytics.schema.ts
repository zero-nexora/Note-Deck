import z from "zod";

export const GetWorkspaceAnalyticsSchema = z.object({
  workspaceId: z.string().min(1),
});

export const GetActivityFeedSchema = z.object({
  workspaceId: z.string().min(1),
  limit: z.number().int().positive().optional().default(50),
});

export type GetWorkspaceAnalyticsInput = z.infer<typeof GetWorkspaceAnalyticsSchema>;
export type GetActivityFeedInput = z.infer<typeof GetActivityFeedSchema>;