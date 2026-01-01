import { db } from "@/db";
import { activities } from "@/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { GetActivityFeedInput, GetWorkspaceAnalyticsInput } from "../schemas/analytics.schema";
import { WorkspaceAnalytics } from "../types/analytics.type";
import { checkWorkspacePermission } from "@/lib/check-permissions";
import { workspaceRepository } from "../repositories/workspace.repository";
import { activityRepository } from "../repositories/activity.repository";

export const analyticsService = {
  findBoardActivityHeatmap: async (
    boardId: string,
    startDate: Date,
    endDate: Date
  ) => {
    const activityData = await db
      .select({
        date: sql<string>`DATE(${activities.createdAt})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(activities)
      .where(
        and(
          eq(activities.boardId, boardId),
          gte(activities.createdAt, startDate),
          lte(activities.createdAt, endDate)
        )
      )
      .groupBy(sql`DATE(${activities.createdAt})`);

    return activityData;
  },

  findTaskCompletionVelocity: async (
    boardId: string,
    startDate: Date,
    endDate: Date
  ) => {
    const completedCards = await db
      .select({
        date: sql<string>`DATE(${activities.createdAt})`,
        count: sql<number>`COUNT(DISTINCT ${activities.cardId})`,
      })
      .from(activities)
      .where(
        and(
          eq(activities.boardId, boardId),
          eq(activities.action, "card.archived"),
          gte(activities.createdAt, startDate),
          lte(activities.createdAt, endDate)
        )
      )
      .groupBy(sql`DATE(${activities.createdAt})`);

    return completedCards;
  },

  findProductivityMetricsByUserId: async (
    userId: string,
    boardId: string,
    startDate: Date,
    endDate: Date
  ) => {
    const matrics = await db
      .select({
        cardsCreated: sql<number>`COUNT(CASE WHEN ${activities.action} = 'card.created' THEN 1 END)`,
        cardsCompleted: sql<number>`COUNT(CASE WHEN ${activities.action} = 'card.archived' THEN 1 END)`,
        commentsAdded: sql<number>`COUNT(CASE WHEN ${activities.action} = 'comment.created' THEN 1 END)`,
      })
      .from(activities)
      .where(
        and(
          eq(activities.userId, userId),
          eq(activities.boardId, boardId),
          gte(activities.createdAt, startDate),
          lte(activities.createdAt, endDate)
        )
      );

    return matrics[0];
  },

  getAnalytics: async (
    userId: string,
    data: GetWorkspaceAnalyticsInput
  ): Promise<WorkspaceAnalytics> => {
    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const [totalBoards, totalLists, totalCards, completionRate, activeMembers] =
      await Promise.all([
        workspaceRepository.getTotalBoards(data.workspaceId),
        workspaceRepository.getTotalLists(data.workspaceId),
        workspaceRepository.getTotalCards(data.workspaceId),
        workspaceRepository.getCompletionRate(data.workspaceId),
        workspaceRepository.getActiveMembers(data.workspaceId),
      ]);

    return {
      totalBoards,
      totalLists,
      totalCards,
      completionRate,
      activeMembers,
    };
  },

  getActivityFeed: async (userId: string, data: GetActivityFeedInput) => {
    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const activities = await activityRepository.findByWorkspaceId(
      data.workspaceId,
      data.limit
    );

    return activities;
  },
};
