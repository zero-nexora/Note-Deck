import { db } from "@/db";
import { activities } from "@/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";

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
};
