import { db } from "@/db";
import { attachments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NewAttachment } from "../types/attachment.type";

export const attachmentRepository = {
  create: async (data: NewAttachment) => {
    const [inserted] = await db.insert(attachments).values(data).returning({
      id: attachments.id,
    });

    const attachment = await db.query.attachments.findFirst({
      where: eq(attachments.id, inserted.id),
      with: {
        user: true,
      },
    });

    return attachment;
  },

  findById: async (id: string) => {
    return db.query.attachments.findFirst({
      where: eq(attachments.id, id),
    });
  },

  // findByCardId: async (cardId: string) => {
  //   return db.query.attachments.findMany({
  //     where: eq(attachments.cardId, cardId),
  //     with: {
  //       user: true,
  //     },
  //     orderBy: (attachments, { desc }) => [desc(attachments.createdAt)],
  //   });
  // },

  delete: async (id: string) => {
    await db.delete(attachments).where(eq(attachments.id, id));
  },
};
