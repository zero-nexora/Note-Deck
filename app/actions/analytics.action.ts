"use server";

import {
  GetActivityFeedInput,
  GetActivityFeedSchema,
  GetActivityTimelineInput,
  GetActivityTimelineSchema,
  GetBoardsPerformanceInput,
  GetBoardsPerformanceSchema,
  GetCardsTrendInput,
  GetCardsTrendSchema,
  GetChecklistStatsInput,
  GetChecklistStatsSchema,
  GetDueDateAnalyticsInput,
  GetDueDateAnalyticsSchema,
  GetLabelsDistributionInput,
  GetLabelsDistributionSchema,
  GetMembersProductivityInput,
  GetMembersProductivitySchema,
  GetWorkspaceAnalyticsInput,
  GetWorkspaceAnalyticsSchema,
} from "@/domain/schemas/analytics.schema";
import { analyticsService } from "@/domain/services/analytics.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const getWorkspaceAnalyticsAction = async (
  input: GetWorkspaceAnalyticsInput
) => {
  try {
    const user = await requireAuth();
    const parsed = GetWorkspaceAnalyticsSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const analytics = await analyticsService.getAnalytics(user.id, parsed.data);
    return success("", analytics);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getActivityFeedAction = async (input: GetActivityFeedInput) => {
  try {
    const user = await requireAuth();
    const parsed = GetActivityFeedSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const activities = await analyticsService.getActivityFeed(
      user.id,
      parsed.data
    );
    return success("", activities);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getWorkspaceStatsAction = async (
  input: GetWorkspaceAnalyticsInput
) => {
  try {
    await requireAuth();
    const parsed = GetWorkspaceAnalyticsSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const analytics = await analyticsService.getWorkspaceStats(
      parsed.data.workspaceId
    );
    return success("", analytics);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getCardsTrendAction = async (input: GetCardsTrendInput) => {
  try {
    await requireAuth();
    const parsed = GetCardsTrendSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const trend = await analyticsService.getCardsTrend(
      parsed.data.workspaceId,
      parsed.data.days
    );
    return success("", trend);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getBoardsPerformanceAction = async (
  input: GetBoardsPerformanceInput
) => {
  try {
    await requireAuth();
    const parsed = GetBoardsPerformanceSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const performance = await analyticsService.getBoardsPerformance(
      parsed.data.workspaceId
    );
    return success("", performance);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getMembersProductivityAction = async (
  input: GetMembersProductivityInput
) => {
  try {
    await requireAuth();
    const parsed = GetMembersProductivitySchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const productivity = await analyticsService.getMembersProductivity(
      parsed.data.workspaceId
    );
    return success("", productivity);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getLabelsDistributionAction = async (
  input: GetLabelsDistributionInput
) => {
  try {
    await requireAuth();
    const parsed = GetLabelsDistributionSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const distribution = await analyticsService.getLabelsDistribution(
      parsed.data.workspaceId
    );
    return success("", distribution);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getActivityTimelineAction = async (
  input: GetActivityTimelineInput
) => {
  try {
    await requireAuth();
    const parsed = GetActivityTimelineSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const timeline = await analyticsService.getActivityTimeline(
      parsed.data.workspaceId,
      parsed.data.days
    );
    return success("", timeline);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getChecklistStatsAction = async (
  input: GetChecklistStatsInput
) => {
  try {
    await requireAuth();
    const parsed = GetChecklistStatsSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const stats = await analyticsService.getChecklistStats(
      parsed.data.workspaceId
    );
    return success("", stats);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getDueDateAnalyticsAction = async (
  input: GetDueDateAnalyticsInput
) => {
  try {
    await requireAuth();
    const parsed = GetDueDateAnalyticsSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const analytics = await analyticsService.getDueDateAnalytics(
      parsed.data.workspaceId
    );
    return success("", analytics);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
