import { db } from "@/db";
import { NewActivity } from "../types/activity.type";
import { activities } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const activityRepository = {
  create: async (data: NewActivity) => {
    const [activity] = await db.insert(activities).values(data).returning();

    return activity;
  },

  findByBoardId: async (boardId: string, limit = 100) => {
    return await db.query.activities.findMany({
      where: eq(activities.boardId, boardId),
      with: {
        user: true,
        card: true,
      },
      orderBy: (activities, { desc }) => [desc(activities.createdAt)],
      limit,
    });
  },

  findByCardId: async (cardId: string, limit = 50) => {
    return await db.query.activities.findMany({
      where: eq(activities.cardId, cardId),
      with: {
        user: true,
      },
      orderBy: (activities, { desc }) => [desc(activities.createdAt)],
      limit,
    });
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
};
