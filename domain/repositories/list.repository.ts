import { db } from "@/db";
import { ListOrder, NewList, UpdateList } from "../types/list.type";
import { lists } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

export const listRepository = {
  create: async (data: NewList) => {
    const [list] = await db.insert(lists).values(data).returning();
    return list;
  },

  findById: async (listId: string) => {
    return db.query.lists.findFirst({
      where: eq(lists.id, listId),
    });
  },

  update: async (listId: string, data: UpdateList) => {
    const [updated] = await db
      .update(lists)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(lists.id, listId))
      .returning();
    return updated;
  },

  delete: async (listId: string) => {
    await db.delete(lists).where(eq(lists.id, listId));
  },

  getMaxPosition: async (boardId: string) => {
    const result = await db.query.lists.findMany({
      where: eq(lists.boardId, boardId),
      orderBy: (lists, { desc }) => [desc(lists.position)],
      limit: 1,
    });
    return result[0]?.position ?? -1;
  },

  reorders: async (boardId: string, orders: ListOrder[]) => {
    await db.transaction(async (tx) => {
      for (const { id, position } of orders) {
        await tx
          .update(lists)
          .set({ position, updatedAt: new Date() })
          .where(and(eq(lists.id, id), eq(lists.boardId, boardId)));
      }
    });
  },

  findAllByBoardId: async (boardId: string) => {
    return db.query.lists.findMany({
      where: eq(lists.boardId, boardId),
      orderBy: [asc(lists.position)],
    });
  },

  findListWithCardsAndBoard: async (listId: string) => {
    return db.query.lists.findFirst({
      where: eq(lists.id, listId),
      with: {
        cards: {
          with: {
            cardLabels: {
              with: {
                label: true,
              },
            },
            checklists: {
              with: {
                items: true,
              },
            },
            attachments: true,
          },
        },
        board: true,
      },
    });
  },
};
