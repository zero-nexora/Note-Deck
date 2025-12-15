import { z } from "zod";
import { NewAttachment, UpdateAttachment } from "../types/attachment.type";

export const CreateAttachmentSchema: z.ZodType<NewAttachment> = z.object({
  cardId: z.string(),
  userId: z.string(),
  fileName: z.string(),
  fileUrl: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  uploadThingKey: z.string(),
  expiresAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
});

export const UpdateAttachmentSchema: z.ZodType<UpdateAttachment> = z.object({
  cardId: z.string().optional(),
  userId: z.string().optional(),
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
  fileType: z.string().optional(),
  fileSize: z.number().optional(),
  uploadThingKey: z.string().optional(),
  expiresAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
});

export type CreateAttachmentInput = z.infer<typeof CreateAttachmentSchema>;
export type UpdateAttachmentInput = z.infer<typeof UpdateAttachmentSchema>;
