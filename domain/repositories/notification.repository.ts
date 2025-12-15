import { db } from "@/db";
import { NewNotification } from "../types/notification.type";
import { notifications } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const notificationRepository = {
  create: async (data: NewNotification) => {
    const [notification] = await db
      .insert(notifications)
      .values(data)
      .returning();

    return notification;
  },

  findByUserId: async (userId: string, limit = 50) => {
    return await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
      limit,
    });
  },

  findUnReadByUserId: async (userId: string) => {
    return await db.query.notifications.findMany({
      where: and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ),
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
    });
  },

  markAsRead: async (notificationId: string) => {
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      .returning();

    return updated;
  },

  markAllAsRead: async (userId: string) => {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      );
  },

  delete: async (id: string) => {
    await db.delete(notifications).where(eq(notifications.id, id));
  },
};
