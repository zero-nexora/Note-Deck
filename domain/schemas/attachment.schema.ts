import { z } from "zod";

export const CreateAttachmentSchema = z.object({
  cardId: z.string().min(1),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string().min(1),
  fileSize: z.number().int().positive(),
  uploadThingKey: z.string().min(1),
  expiresAt: z.date().optional(),
});

export const DeleteAttachmentSchema = z.object({
  id: z.string().min(1),
});

export type CreateAttachmentInput = z.infer<typeof CreateAttachmentSchema>;
export type DeleteAttachmentInput = z.infer<typeof DeleteAttachmentSchema>;