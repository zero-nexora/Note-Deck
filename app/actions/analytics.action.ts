"use server";

import {
  GetActivityFeedInput,
  GetActivityFeedSchema,
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
