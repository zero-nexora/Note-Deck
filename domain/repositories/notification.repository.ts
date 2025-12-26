import { db } from "@/db";
import { NewNotification } from "../types/notification.type";
import { notifications } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const notificationRepository = {
  create: async (data: NewNotification) => {
    const [notification] = await db
      .insert(notifications)
      .values(data)
      .returning();
    return notification;
  },

  findById: async (id: string) => {
    const notification = await db.query.notifications.findFirst({
      where: eq(notifications.id, id),
    });
    return notification;
  },

  findByUserId: async (userId: string, unreadOnly = false) => {
    const query = unreadOnly
      ? and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      : eq(notifications.userId, userId);

    const userNotifications = await db.query.notifications.findMany({
      where: query,
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
    });
    return userNotifications;
  },

  markAsRead: async (id: string) => {
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
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
