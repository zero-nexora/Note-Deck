import { db } from "@/db";
import { NewChecklist, UpdateChecklist } from "../types/check-list.type";
import { boards, cards, checklistItems, checklists } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";

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

  getChecklistDataByWorkspaceId: async (workspaceId: string) => {
    return await db
      .select({
        checklistId: checklists.id,
        totalItems: count(checklistItems.id),
        completedItems: sql<number>`
        SUM(CASE WHEN ${checklistItems.isCompleted} THEN 1 ELSE 0 END)
      `,
      })
      .from(checklists)
      .innerJoin(cards, eq(checklists.cardId, cards.id))
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .leftJoin(checklistItems, eq(checklistItems.checklistId, checklists.id))
      .where(eq(boards.workspaceId, workspaceId))
      .groupBy(checklists.id);
  },
};
