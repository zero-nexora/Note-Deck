import { NOTIFICATION_TYPE } from "@/lib/constants";
import { z } from "zod";

export const CreateNotificationSchema = z.object({
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
  type: z.nativeEnum(NOTIFICATION_TYPE, { message: "Type is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  entityType: z.string().optional(),
  entityId: z
    .string()
    .uuid({ message: "Invalid UUID for entityId" })
    .optional(),
});

export const MarkAsReadSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const DeleteNotificationSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type MarkAsReadInput = z.infer<typeof MarkAsReadSchema>;
export type DeleteNotificationInput = z.infer<typeof DeleteNotificationSchema>;
