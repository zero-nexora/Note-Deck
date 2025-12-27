import { notificationRepository } from "../repositories/notification.repository";
import {
  CreateNotificationInput,
  DeleteNotificationInput,
  MarkAsReadInput,
} from "../schemas/notification.schema";
import { sendPushNotification } from "@/lib/push";

export const notificationService = {
  create: async (data: CreateNotificationInput) => {
    const notification = await notificationRepository.create(data);
    return notification;
  },

  markAsRead: async (userId: string, data: MarkAsReadInput) => {
    const notification = await notificationRepository.findById(data.id);
    if (!notification) throw new Error("Notification not found");

    if (notification.userId !== userId) {
      throw new Error("Permission denied");
    }

    const updated = await notificationRepository.markAsRead(data.id);
    return updated;
  },

  markAllAsRead: async (userId: string) => {
    await notificationRepository.markAllAsRead(userId);
  },

  delete: async (userId: string, data: DeleteNotificationInput) => {
    const notification = await notificationRepository.findById(data.id);
    if (!notification) throw new Error("Notification not found");

    if (notification.userId !== userId) {
      throw new Error("Permission denied");
    }

    await notificationRepository.delete(data.id);
  },

  list: async (userId: string, unreadOnly = false) => {
    const notifications = await notificationRepository.findByUserId(
      userId,
      unreadOnly
    );
    return notifications;
  },

  sendWebPush: async (
    userId: string,
    title: string,
    body: string,
    data?: any
  ) => {
    await sendPushNotification();
  },
};
