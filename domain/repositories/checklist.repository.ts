import { db } from "@/db";
import { NewChecklist, UpdateChecklist } from "../types/check-list.type";
import { checklists } from "@/db/schema";
import { eq } from "drizzle-orm";

export const checklistRepository = {
  create: async (data: NewChecklist) => {
    const [checklist] = await db.insert(checklists).values(data).returning();

    return checklist;
  },

  findById: async (id: string) => {
    return db.query.checklists.findFirst({
      where: eq(checklists.id, id),
    });
  },

  findByCardId: async (cardId: string) => {
    return await db.query.checklists.findMany({
      where: eq(checklists.cardId, cardId),
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.position)],
        },
      },
      orderBy: (checklists, { asc }) => [asc(checklists.position)],
    });
  },

  update: async (id: string, data: UpdateChecklist) => {
    const [updated] = await db
      .update(checklists)
      .set(data)
      .where(eq(checklists.id, id))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(checklists).where(eq(checklists.id, id));
  },

  getMaxPosition: async (cardId: string) => {
    const result = await db.query.checklists.findMany({
      where: eq(checklists.cardId, cardId),
      orderBy: (checklists, { desc }) => [desc(checklists.position)],
      limit: 1,
    });
    return result[0]?.position ?? -1;
  },
};
