import { sendEmail } from "@/lib/email";
import { notificationRepository } from "../repositories/notification.repository";
import { CreateNotificationInput } from "../schemas/notification.schema";
import { sendPushNotification } from "@/lib/push";

export const notificationService = {
  create: async (data: CreateNotificationInput) => {
    const notification = await notificationRepository.create(data);

    return notification;
  },

  sendEmail: async (email: string, subject: string, content: string) => {
    await sendEmail(email, subject, content);
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
