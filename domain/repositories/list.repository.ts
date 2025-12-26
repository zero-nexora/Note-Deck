import { db } from "@/db";
import { NewList, UpdateList } from "../types/list.type";
import { lists } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

export const listRepository = {
  create: async (data: NewList) => {
    const [list] = await db.insert(lists).values(data).returning();
    return list;
  },

  findById: async (id: string) => {
    const list = await db.query.lists.findFirst({
      where: eq(lists.id, id),
      with: {
        cards: {
          where: (cards) => eq(cards.isArchived, false),
          orderBy: (cards, { asc }) => [asc(cards.position)],
        },
      },
    });
    return list;
  },

  update: async (id: string, data: UpdateList) => {
    const [updated] = await db
      .update(lists)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(lists.id, id))
      .returning();
    return updated;
  },

  delete: async (id: string) => {
    await db.delete(lists).where(eq(lists.id, id));
  },

  getMaxPosition: async (boardId: string) => {
    const result = await db.query.lists.findMany({
      where: eq(lists.boardId, boardId),
      orderBy: (lists, { desc }) => [desc(lists.position)],
      limit: 1,
    });
    return result[0]?.position ?? -1;
  },

  reorders: async (
    boardId: string,
    listOrders: { id: string; position: number }[]
  ) => {
    await db.transaction(async (tx) => {
      for (const { id, position } of listOrders) {
        await tx
          .update(lists)
          .set({ position, updatedAt: new Date() })
          .where(and(eq(lists.id, id), eq(lists.boardId, boardId)));
      }
    });
  },

  // TODO: review
  updatePositions: async (
    boardId: string,
    startPosition: number,
    increment: number
  ) => {
    await db
      .update(lists)
      .set({
        position: sql`${lists.position} + ${increment}`,
      })
      .where(
        and(eq(lists.boardId, boardId), gte(lists.position, startPosition))
      );
  },
};
