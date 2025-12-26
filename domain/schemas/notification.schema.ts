import { z } from "zod";
import { NotificationTypeEnum } from "@/db/enum";

export const CreateNotificationSchema = z.object({
  userId: z.string().min(1),
  type: NotificationTypeEnum,
  title: z.string().min(1),
  message: z.string().min(1),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
});

export const MarkAsReadSchema = z.object({
  id: z.string().min(1),
});

export const DeleteNotificationSchema = z.object({
  id: z.string().min(1),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type MarkAsReadInput = z.infer<typeof MarkAsReadSchema>;
export type DeleteNotificationInput = z.infer<typeof DeleteNotificationSchema>;
