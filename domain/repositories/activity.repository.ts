import { db } from "@/db";
import { NewActivity } from "../types/activity.type";
import { activities, boards, cards, users } from "@/db/schema";
import { and, asc, count, desc, eq, gte, sql } from "drizzle-orm";
import { DEFAULT_ACTIVITY, DEFAULT_LIMIT_ACTIVITY } from "@/lib/constants";

export const activityRepository = {
  create: async (data: NewActivity) => {
    const [activity] = await db
      .insert(activities)
      .values({ ...data, metadata: data.metadata ?? {} })
      .returning();
    return activity;
  },

  findByCardId: async (cardId: string, limit = DEFAULT_LIMIT_ACTIVITY) => {
    return db.query.activities.findMany({
      where: eq(activities.cardId, cardId),
      orderBy: [desc(activities.createdAt)],
      limit,
    });
  },

  findByBoardId: async (boardId: string, limit = DEFAULT_ACTIVITY) => {
    return db.query.activities.findMany({
      where: eq(activities.boardId, boardId),
      with: {
        user: true,
        card: true,
      },
      orderBy: [desc(activities.createdAt)],
      limit,
    });
  },

  findByCardIdWithUser: async (cardId: string, limit = DEFAULT_ACTIVITY) => {
    return db.query.activities.findMany({
      where: eq(activities.cardId, cardId),
      with: {
        user: true,
      },
      orderBy: [desc(activities.createdAt)],
      limit,
    });
  },

  findByUserId: async (
    userId: string,
    boardId: string,
    limit = DEFAULT_ACTIVITY
  ) => {
    return db.query.activities.findMany({
      where: and(
        eq(activities.userId, userId),
        eq(activities.boardId, boardId)
      ),
      with: {
        card: true,
      },
      orderBy: (activities, { desc }) => [desc(activities.createdAt)],
      limit,
    });
  },

  findByWorkspaceId: async (workspaceId: string, limit = 100) => {
    return db
      .select({
        id: activities.id,
        boardId: activities.boardId,
        cardId: activities.cardId,
        userId: activities.userId,
        action: activities.action,
        entityType: activities.entityType,
        entityId: activities.entityId,
        metadata: activities.metadata,
        createdAt: activities.createdAt,

        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },

        card: {
          id: cards.id,
          title: cards.title,
          listId: cards.listId,
        },

        board: {
          id: boards.id,
          name: boards.name,
        },
      })
      .from(activities)
      .innerJoin(boards, eq(activities.boardId, boards.id))
      .innerJoin(users, eq(activities.userId, users.id))
      .leftJoin(cards, eq(activities.cardId, cards.id))
      .where(eq(boards.workspaceId, workspaceId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  },

  getActiveMembersByWorkspaceId: async (workspaceId: string, since: Date) => {
    const result = await db
      .selectDistinct({ userId: activities.userId })
      .from(activities)
      .innerJoin(boards, eq(activities.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          gte(activities.createdAt, since)
        )
      );
    return result.length;
  },

  getTotalActivitiesByBoardId: async (boardId: string) => {
    const [res] = await db
      .select({ count: count() })
      .from(activities)
      .where(eq(activities.boardId, boardId));
    return res.count;
  },

  getActivitiesCountByUserId: async (userId: string, workspaceId: string) => {
    const [res] = await db
      .select({ count: count() })
      .from(activities)
      .innerJoin(boards, eq(activities.boardId, boards.id))
      .where(
        and(eq(activities.userId, userId), eq(boards.workspaceId, workspaceId))
      );
    return res.count;
  },

  getActivitiesByHour: async (workspaceId: string, startDate: Date) => {
    return db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${activities.createdAt})`,
        count: count(),
      })
      .from(activities)
      .innerJoin(boards, eq(activities.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          gte(activities.createdAt, startDate)
        )
      )
      .groupBy(sql`EXTRACT(HOUR FROM ${activities.createdAt})`)
      .orderBy(asc(sql`EXTRACT(HOUR FROM ${activities.createdAt})`));
  },
};
