import { z } from "zod";

export const GetWorkspaceAnalyticsSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
});

export const GetActivityFeedSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  limit: z
    .number()
    .int()
    .positive({ message: "Limit must be positive" })
    .optional()
    .default(50),
});

export const GetCardsTrendSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  days: z
    .number()
    .int()
    .positive({ message: "Days must be positive" })
    .optional(),
});

export const GetBoardsPerformanceSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
});

export const GetMembersProductivitySchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
});

export const GetLabelsDistributionSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
});

export const GetActivityTimelineSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  days: z
    .number()
    .int()
    .positive({ message: "Days must be positive" })
    .optional(),
});

export const GetChecklistStatsSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
});

export const GetDueDateAnalyticsSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
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
