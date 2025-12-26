import { db } from "@/db";
import { checklistItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  NewChecklistItem,
  UpdateChecklistItem,
} from "../types/check-list-item.type";

export const checklistItemRepository = {
  create: async (data: NewChecklistItem) => {
    const [item] = await db.insert(checklistItems).values(data).returning();
    return item;
  },

  findById: async (id: string) => {
    return db.query.checklistItems.findFirst({
      where: eq(checklistItems.id, id),
    });
  },

  findByChecklistId: async (checklistId: string) => {
    return db.query.checklistItems.findMany({
      where: eq(checklistItems.checklistId, checklistId),
      orderBy: (items, { asc }) => [asc(items.position)],
    });
  },

  update: async (id: string, data: UpdateChecklistItem) => {
    const [updated] = await db
      .update(checklistItems)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(checklistItems.id, id))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(checklistItems).where(eq(checklistItems.id, id));
  },

  getMaxPosition: async (checklistId: string) => {
    const result = await db.query.checklistItems.findMany({
      where: eq(checklistItems.checklistId, checklistId),
      orderBy: (items, { desc }) => [desc(items.position)],
      limit: 1,
    });
    return result[0]?.position ?? -1;
  },
};
