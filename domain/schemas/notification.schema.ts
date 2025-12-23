import { z } from "zod";
import { NotificationTypeEnum } from "@/db/enum";

export const CreateNotificationSchema = z.object({
  userId: z.string(),
  type: NotificationTypeEnum,
  title: z.string(),
  message: z.string(),
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
});

export const UpdateNotificationSchema = z.object({
  userId: z.string(),
  type: NotificationTypeEnum.optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
  isRead: z.boolean().optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>;
