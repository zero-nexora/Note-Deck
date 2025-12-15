import { attachments } from "@/db/schema";
import { NewAttachment } from "../types/attachment.type";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export const attachmentRepository = {
  create: async (data: NewAttachment) => {
    const [attachment] = await db.insert(attachments).values(data).returning();

    return attachment;
  },

  findByCardId: async (cardId: string) => {
    return await db.query.attachments.findMany({
      where: eq(attachments.cardId, cardId),
      with: {
        user: true,
      },
      orderBy: (attachments, { desc }) => [desc(attachments.createdAt)],
    });
  },

  delete: async (id: string) => {
    await db.delete(attachments).where(eq(attachments.id, id));
  },
};
