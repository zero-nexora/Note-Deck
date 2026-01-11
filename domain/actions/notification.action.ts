"use server";

import {
  CreateNotificationInput,
  CreateNotificationSchema,
  MarkAsReadInput,
  MarkAsReadSchema,
  DeleteNotificationInput,
  DeleteNotificationSchema,
} from "@/domain/schemas/notification.schema";
import { notificationService } from "@/domain/services/notification.service";
import { requireAuth } from "@/lib/session";
import { success, error } from "@/lib/response";

export const createNotificationAction = async (
  input: CreateNotificationInput
) => {
  try {
    const parsed = CreateNotificationSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const notification = await notificationService.create(parsed.data);
    return success("Notification created successfully", notification);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const markAsReadAction = async (input: MarkAsReadInput) => {
  try {
    const user = await requireAuth();
    const parsed = MarkAsReadSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const notification = await notificationService.markAsRead(
      user.id,
      parsed.data
    );
    return success("Notification marked as read", notification);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const markAllAsReadAction = async () => {
  try {
    const user = await requireAuth();
    await notificationService.markAllAsRead(user.id);
    return success("All notifications marked as read");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteNotificationAction = async (
  input: DeleteNotificationInput
) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteNotificationSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    await notificationService.delete(user.id, parsed.data);
    return success("Notification deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const listNotificationsAction = async (unreadOnly = false) => {
  try {
    const user = await requireAuth();
    const notifications = await notificationService.list(user.id, unreadOnly);
    return success("", notifications);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
