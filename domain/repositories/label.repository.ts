import { db } from "@/db";
import { NewLabel, UpdateLabel } from "../types/label.type";
import { labels } from "@/db/schema";
import { eq } from "drizzle-orm";

export const labelRepository = {
  create: async (data: NewLabel) => {
    const [label] = await db.insert(labels).values(data).returning();

    return label;
  },

  findByBoardId: async (boardId: string) => {
    return await db.query.labels.findMany({
      where: eq(labels.boardId, boardId),
    });
  },

  update: async (data: UpdateLabel) => {
    const [updated] = await db
      .update(labels)
      .set(data)
      .where(eq(labels.id, data.id!))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(labels).where(eq(labels.id, id));
  },
};
