import z from "zod";

export const GetWorkspaceAnalyticsSchema = z.object({
  workspaceId: z.string().min(1),
});

export const GetActivityFeedSchema = z.object({
  workspaceId: z.string().min(1),
  limit: z.number().int().positive().optional().default(50),
});

export const GetCardsTrendSchema = z.object({
  workspaceId: z.string().min(1),
  days: z.number().min(1).optional(),
});

export const GetBoardsPerformanceSchema = z.object({
  workspaceId: z.string().min(1),
});

export const GetMembersProductivitySchema = z.object({
  workspaceId: z.string().min(1),
});

export const GetLabelsDistributionSchema = z.object({
  workspaceId: z.string().min(1),
});

export const GetActivityTimelineSchema = z.object({
  workspaceId: z.string().min(1),
  days: z.number().min(1).optional(),
});

export const GetChecklistStatsSchema = z.object({
  workspaceId: z.string().min(1),
});

export const GetDueDateAnalyticsSchema = z.object({
  workspaceId: z.string().min(1),
});

export type GetWorkspaceAnalyticsInput = z.infer<
  typeof GetWorkspaceAnalyticsSchema
>;
export type GetActivityFeedInput = z.infer<typeof GetActivityFeedSchema>;
export type GetCardsTrendInput = z.infer<typeof GetCardsTrendSchema>;
export type GetBoardsPerformanceInput = z.infer<
  typeof GetBoardsPerformanceSchema
>;
export type GetMembersProductivityInput = z.infer<
  typeof GetMembersProductivitySchema
>;
export type GetLabelsDistributionInput = z.infer<
  typeof GetLabelsDistributionSchema
>;
export type GetActivityTimelineInput = z.infer<
  typeof GetActivityTimelineSchema
>;
export type GetChecklistStatsInput = z.infer<typeof GetChecklistStatsSchema>;
export type GetDueDateAnalyticsInput = z.infer<
  typeof GetDueDateAnalyticsSchema
>;
