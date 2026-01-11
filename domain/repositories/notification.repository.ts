import { db } from "@/db";
import { NewNotification } from "../types/notification.type";
import { notifications } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { DEFAULT_LIMIT_NOTIFICATION } from "@/lib/constants";

export const notificationRepository = {
  create: async (data: NewNotification) => {
    const [notification] = await db
      .insert(notifications)
      .values(data)
      .returning();
    return notification;
  },

  findById: async (id: string) => {
    return db.query.notifications.findFirst({
      where: eq(notifications.id, id),
    });
  },

  findByUserIdWithUser: async (userId: string, unreadOnly = false) => {
    const query = unreadOnly
      ? and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      : eq(notifications.userId, userId);

    return db.query.notifications.findMany({
      where: query,
      with: {
        user: true,
      },
      orderBy: [desc(notifications.createdAt)],
      limit: DEFAULT_LIMIT_NOTIFICATION,
    });
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
