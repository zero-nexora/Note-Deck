import { db } from "@/db";
import { activities } from "@/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import {
  GetActivityFeedInput,
  GetWorkspaceAnalyticsInput,
} from "../schemas/analytics.schema";
import {
  ActivityTimeline,
  BoardPerformance,
  CardsTrend,
  ChecklistStats,
  DueDateAnalytics,
  LabelDistribution,
  MemberProductivity,
  WorkspaceAnalytics,
  WorkspaceStats,
} from "../types/analytics.type";
import { checkWorkspacePermission } from "@/lib/check-permissions";
import { workspaceRepository } from "../repositories/workspace.repository";
import { activityRepository } from "../repositories/activity.repository";
import { boardRepository } from "../repositories/board.repository";
import { cardRepository } from "../repositories/card.repository";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository";
import { cardMemberRepository } from "../repositories/card-member.repository";
import { commentRepository } from "../repositories/comment.repository";
import { labelRepository } from "../repositories/label.repository";
import { checklistRepository } from "../repositories/checklist.repository";

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

  getWorkspaceStats: async (workspaceId: string): Promise<WorkspaceStats> => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalBoards,
      totalCards,
      totalMembers,
      completedCards,
      overdueCards,
      cardsCreatedThisWeek,
      cardsCreatedThisMonth,
      activeMembers,
    ] = await Promise.all([
      boardRepository.getTotalBoardsByWorkspaceId(workspaceId),
      cardRepository.getTotalCardsByWorksapceId(workspaceId),
      workspaceMemberRepository.getTotalMembersByWorkspaceId(workspaceId),
      cardRepository.getCompletedCardsByWorkspaceId(workspaceId),
      cardRepository.getOverdueCardsByWorkspaceId(workspaceId, now),
      cardRepository.getCardsCreatedSinceByWorkspaceId(workspaceId, weekAgo),
      cardRepository.getCardsCreatedSinceByWorkspaceId(workspaceId, monthAgo),
      activityRepository.getActiveMembersByWorkspaceId(workspaceId, weekAgo),
    ]);

    return {
      totalBoards,
      totalCards,
      totalMembers,
      completedCards,
      overdueCards,
      cardsCreatedThisWeek,
      cardsCreatedThisMonth,
      activeMembers,
      averageCardsPerBoard:
        totalBoards > 0 ? Math.round(totalCards / totalBoards) : 0,
    };
  },

  getCardsTrend: async (
    workspaceId: string,
    days: number = 30
  ): Promise<CardsTrend[]> => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [cardsData, completedData] = await Promise.all([
      cardRepository.getCardsCreatedByWorkspaceIdAndDate(
        workspaceId,
        startDate
      ),
      cardRepository.getCardsCompletedByWorkspaceIdAndDate(
        workspaceId,
        startDate
      ),
    ]);

    const trendMap = new Map<string, CardsTrend>();

    cardsData.forEach((item) => {
      trendMap.set(item.date, {
        date: item.date,
        created: item.created,
        completed: 0,
        inProgress: 0,
      });
    });

    completedData.forEach((item) => {
      const existing = trendMap.get(item.date);
      if (existing) {
        existing.completed = item.completed;
      } else {
        trendMap.set(item.date, {
          date: item.date,
          created: 0,
          completed: item.completed,
          inProgress: 0,
        });
      }
    });

    trendMap.forEach((value) => {
      value.inProgress = value.created - value.completed;
    });

    return Array.from(trendMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  },

  getBoardsPerformance: async (
    workspaceId: string
  ): Promise<BoardPerformance[]> => {
    const boardsList = await boardRepository.getBoardsByWorkspaceId(
      workspaceId
    );

    const now = new Date();
    const performance: BoardPerformance[] = [];

    for (const board of boardsList) {
      const [
        totalCards,
        completedCards,
        overdueCards,
        completedCardsDates,
        totalActivities,
      ] = await Promise.all([
        cardRepository.getTotalCardsByBoardId(board.id),
        cardRepository.getCompletedCardsByBoardId(board.id),
        cardRepository.getOverdueCardsByBoardId(board.id, now),
        cardRepository.getCompletedCardsDatesByBoardId(board.id, 100),
        activityRepository.getTotalActivitiesByBoardId(board.id),
      ]);

      let avgCompletionTime = 0;
      if (completedCardsDates.length > 0) {
        const totalTime = completedCardsDates.reduce((sum, card) => {
          const diff = card.updatedAt.getTime() - card.createdAt.getTime();
          return sum + diff / (1000 * 60 * 60 * 24);
        }, 0);
        avgCompletionTime = totalTime / completedCardsDates.length;
      }

      const total = totalCards + completedCards;
      const completionRate = total > 0 ? (completedCards / total) * 100 : 0;

      performance.push({
        boardId: board.id,
        boardName: board.name,
        totalCards,
        completedCards,
        overdueCards,
        completionRate: Math.round(completionRate * 10) / 10,
        averageCompletionTime: Math.round(avgCompletionTime * 10) / 10,
        totalActivities,
      });
    }

    return performance.sort((a, b) => b.totalActivities - a.totalActivities);
  },

  getMembersProductivity: async (
    workspaceId: string
  ): Promise<MemberProductivity[]> => {
    const members = await workspaceMemberRepository.getMembersByWorkspaceId(
      workspaceId
    );
    const productivity: MemberProductivity[] = [];

    for (const member of members) {
      const [assignedCards, completedCards, commentsCount, activitiesCount] =
        await Promise.all([
          cardMemberRepository.getAssignedCardsByUserId(
            member.userId,
            workspaceId
          ),
          cardMemberRepository.getCompletedCardsByUserId(
            member.userId,
            workspaceId
          ),
          commentRepository.getCommentsCountByUserId(
            member.userId,
            workspaceId
          ),
          activityRepository.getActivitiesCountByUserId(
            member.userId,
            workspaceId
          ),
        ]);

      const total = assignedCards + completedCards;
      const completionRate = total > 0 ? (completedCards / total) * 100 : 0;

      productivity.push({
        userId: member.userId,
        userName: member.userName || "Unknown",
        userEmail: member.userEmail || "",
        userImage: member.userImage,
        assignedCards,
        completedCards,
        commentsCount,
        activitiesCount,
        completionRate: Math.round(completionRate * 10) / 10,
      });
    }

    return productivity.sort((a, b) => b.activitiesCount - a.activitiesCount);
  },

  getLabelsDistribution: async (
    workspaceId: string
  ): Promise<LabelDistribution[]> => {
    const labelData = await labelRepository.getLabelDataByWorkspaceId(
      workspaceId
    );

    const totalCards = labelData.reduce(
      (sum, item) => sum + item.cardsCount,
      0
    );

    return labelData.map((item) => ({
      labelId: item.labelId,
      labelName: item.labelName,
      labelColor: item.labelColor,
      cardsCount: item.cardsCount,
      percentage:
        totalCards > 0
          ? Math.round((item.cardsCount / totalCards) * 100 * 10) / 10
          : 0,
    }));
  },

  getActivityTimeline: async (
    workspaceId: string,
    days: number = 7
  ): Promise<ActivityTimeline[]> => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activitiesData = await activityRepository.getActivitiesByHour(
      workspaceId,
      startDate
    );

    const timelineMap = new Map<number, number>();
    for (let i = 0; i < 24; i++) {
      timelineMap.set(i, 0);
    }

    activitiesData.forEach((item) => {
      timelineMap.set(item.hour, item.count);
    });

    return Array.from(timelineMap.entries()).map(([hour, count]) => ({
      hour,
      count,
    }));
  },

  getChecklistStats: async (workspaceId: string): Promise<ChecklistStats> => {
    const checklistsData =
      await checklistRepository.getChecklistDataByWorkspaceId(workspaceId);

    const totalChecklists = checklistsData.length;
    const totalItems = checklistsData.reduce(
      (sum, item) => sum + item.totalItems,
      0
    );
    const completedItems = checklistsData.reduce(
      (sum, item) => sum + Number(item.completedItems),
      0
    );

    return {
      totalChecklists,
      totalItems,
      completedItems,
      completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
      averageItemsPerChecklist:
        totalChecklists > 0 ? totalItems / totalChecklists : 0,
    };
  },

  getDueDateAnalytics: async (
    workspaceId: string
  ): Promise<DueDateAnalytics> => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      [overdueResult],
      [dueTodayResult],
      [dueWeekResult],
      [dueMonthResult],
      [noDueDateResult],
    ] = await Promise.all([
      cardRepository.getOverdueCardsCount(workspaceId, today),
      cardRepository.getDueTodayCardsCount(workspaceId, today),
      cardRepository.getDueThisWeekCardsCount(workspaceId, today, weekFromNow),
      cardRepository.getDueThisMonthCardsCount(
        workspaceId,
        today,
        monthFromNow
      ),
      cardRepository.getNoDueDateCardsCount(workspaceId),
    ]);

    return {
      overdue: overdueResult.count,
      dueToday: dueTodayResult.count,
      dueThisWeek: dueWeekResult.count,
      dueThisMonth: dueMonthResult.count,
      noDueDate: noDueDateResult.count,
    };
  },
};
