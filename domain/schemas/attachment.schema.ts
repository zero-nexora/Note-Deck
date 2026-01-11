import z from "zod";

export const CreateAttachmentSchema = z.object({
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }),
  fileName: z.string().min(1, { message: "File name is required" }),
  fileUrl: z.string().url({ message: "Invalid file URL" }),
  fileType: z.string().min(1, { message: "File type is required" }),
  fileSize: z
    .number()
    .int()
    .positive({ message: "File size must be positive" }),
  uploadThingKey: z.string(),
  expiresAt: z.date().optional(),
});

export const DeleteAttachmentSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export type CreateAttachmentInput = z.infer<typeof CreateAttachmentSchema>;
export type DeleteAttachmentInput = z.infer<typeof DeleteAttachmentSchema>;
