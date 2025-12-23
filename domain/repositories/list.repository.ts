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
    });
    return list;
  },

  findByBoardId: async (boardId: string) => {
    const listsByBoard = await db.query.lists.findMany({
      where: and(eq(lists.boardId, boardId), eq(lists.isArchived, false)),
      orderBy: (lists, { asc }) => [asc(lists.position)],
    });
    return listsByBoard;
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

  archive: async (id: string) => {
    return listRepository.update(id, { isArchived: true });
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
