import { db } from "@/db";
import { NewChecklist, UpdateChecklist } from "../types/check-list.type";
import { checklists } from "@/db/schema";
import { eq } from "drizzle-orm";

export const checklistRepository = {
  create: async (data: NewChecklist) => {
    const [checklist] = await db.insert(checklists).values(data).returning();

    return checklist;
  },

  findByCardId: async (cardId: string) => {
    return await db.query.checklists.findMany({
      where: eq(checklists.cardId, cardId),
      with: {
        items: {
          orderBy: (items, { desc }) => [desc(items.createdAt)],
        },
      },
      orderBy: (checklists, { desc }) => [desc(checklists.createdAt)],
    });
  },

  update: async (data: UpdateChecklist) => {
    const [updated] = await db
      .update(checklists)
      .set(data)
      .where(eq(checklists.id, data.id!))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(checklists).where(eq(checklists.id, id));
  },
};
