import { db } from "@/db";
import { NewCard, UpdateCard } from "../types/card.type";
import { cards } from "@/db/schema";
import { and, eq } from "drizzle-orm";

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
          orderBy: (checklists, { asc }) => [asc(checklists.position)],
          with: {
            items: {
              orderBy: (items, { asc }) => [asc(items.position)],
            },
          },
        },
        comments: {
          orderBy: (comments, { asc }) => [asc(comments.createdAt)],
          with: {
            user: true,
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

  findCardsByListId: async (listId: string) => {
    return db.query.cards.findMany({
      where: and(eq(cards.listId, listId), eq(cards.isArchived, false)),
      orderBy: (cards, { asc }) => [asc(cards.position)],
    });
  },

  update: async (id: string, data: UpdateCard) => {
    const [updated] = await db
      .update(cards)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(cards.id, data.id!))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(cards).where(eq(cards.id, id));
  },

  archive: async (id: string) => {
    return cardRepository.update(id, { isArchived: true });
  },

  move: async (cardId: string, destinationListId: string, position: number) => {
    const [moved] = await db
      .update(cards)
      .set({
        listId: destinationListId,
        position,
        updatedAt: new Date(),
      })
      .where(eq(cards.id, cardId))
      .returning();

    return moved;
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
