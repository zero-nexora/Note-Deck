import { db } from "@/db";
import { NewActivity } from "../types/activity.type";
import { activities, boards, cards, users } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const activityRepository = {
  create: async (data: NewActivity) => {
    const [activity] = await db
      .insert(activities)
      .values({ ...data, metadata: data.metadata ?? {} })
      .returning();
    return activity;
  },

  findByBoardId: async (boardId: string, limit = 100) => {
    const boardActivities = await db.query.activities.findMany({
      where: eq(activities.boardId, boardId),
      with: {
        user: true,
        card: true,
      },
      orderBy: [desc(activities.createdAt)],
      limit,
    });

    return boardActivities;
  },

  findByCardId: async (cardId: string, limit = 50) => {
    const cardActivities = await db.query.activities.findMany({
      where: eq(activities.cardId, cardId),
      with: {
        user: true,
      },
      orderBy: [desc(activities.createdAt)],
      limit,
    });

    return cardActivities;
  },

  findByUserId: async (userId: string, boardId: string, limit = 50) => {
    return await db.query.activities.findMany({
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
};
