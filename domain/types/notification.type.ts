import { notifications } from "@/db/schema";
import { notificationService } from "../services/notification.service";

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type UpdateNotification = Partial<NewNotification>;

export type NotificationWithUser = Awaited<ReturnType<typeof notificationService.list>>[number]