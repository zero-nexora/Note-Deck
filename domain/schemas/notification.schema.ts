import { z } from "zod";
import { NotificationTypeEnum } from "@/db/enum";
import {
  NewNotification,
  UpdateNotification,
} from "../types/notification.type";

export const CreateNotificationSchema: z.ZodType<NewNotification> = z.object({
  userId: z.string(),
  type: NotificationTypeEnum,
  title: z.string(),
  message: z.string(),
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
  isRead: z.boolean().optional(),
  createdAt: z.date().optional(),
});

export const UpdateNotificationSchema: z.ZodType<UpdateNotification> = z.object(
  {
    userId: z.string().optional(),
    type: NotificationTypeEnum.optional(),
    title: z.string().optional(),
    message: z.string().optional(),
    entityType: z.string().nullable().optional(),
    entityId: z.string().nullable().optional(),
    isRead: z.boolean().optional(),
    updatedAt: z.date().optional(),
  }
);

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>;
