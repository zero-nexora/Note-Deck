import { db } from "@/db";
import {
  NewChecklistItem,
  UpdateChecklistItem,
} from "../types/check-list-item.type";
import { checklistItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export const checklistItemRepository = {
  create: async (data: NewChecklistItem) => {
    const [item] = await db.insert(checklistItems).values(data).returning();
    return item;
  },

  update: async (data: UpdateChecklistItem) => {
    const [updated] = await db
      .update(checklistItems)
      .set(data)
      .where(eq(checklistItems.id, data.id!))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(checklistItems).where(eq(checklistItems.id, id));
  },
};
