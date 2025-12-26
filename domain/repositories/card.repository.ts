import { db } from "@/db";
import { NewCard, UpdateCard } from "../types/card.type";
import { cards } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const cardRepository = {
  create: async (data: NewCard) => {
    const [card] = await db.insert(cards).values(data).returning();
    return card;
  },

  findById: async (id: string) => {
    const card = await db.query.cards.findFirst({
      where: eq(cards.id, id),
      with: {
        list: true,
        board: true,
        labels: {
          with: {
            label: true,
          },
        },
        members: {
          with: {
            user: true,
          },
        },
        checklists: {
          with: {
            items: { orderBy: (items, { asc }) => [asc(items.position)] },
          },
          orderBy: (checklists, { asc }) => [asc(checklists.position)],
        },
        comments: {
          where: (comments) => isNull(comments.parentId),
          orderBy: (comments, { asc }) => [asc(comments.createdAt)],
          with: {
            user: true,
            replies: {
              with: {
                user: true,
              },
            },
            reactions: {
              with: {
                user: true,
              },
            },
          },
        },
        attachments: {
          orderBy: (attachments, { desc }) => [desc(attachments.createdAt)],
          with: {
            user: true,
          },
        },
        activities: {
          orderBy: (activities, { desc }) => [desc(activities.createdAt)],
          with: {
            user: true,
          },
          limit: 50,
        },
      },
    });

    return card;
  },

  update: async (id: string, data: UpdateCard) => {
    const [updated] = await db
      .update(cards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cards.id, id))
      .returning();
    return updated;
  },

  delete: async (id: string) => {
    await db.delete(cards).where(eq(cards.id, id));
  },

  getMaxPosition: async (listId: string) => {
    const result = await db.query.cards.findMany({
      where: eq(cards.listId, listId),
      orderBy: (cards, { desc }) => [desc(cards.position)],
      limit: 1,
    });
    return result[0]?.position ?? -1;
  },

  reoders: async (
    listId: string,
    cardOrders: { id: string; position: number }[]
  ) => {
    await db.transaction(async (tx) => {
      for (const { id, position } of cardOrders) {
        await tx
          .update(cards)
          .set({ position, updatedAt: new Date() })
          .where(and(eq(cards.id, id), eq(cards.listId, listId)));
      }
    });
  },
};
