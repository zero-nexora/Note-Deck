import { db } from "@/db";
import { NewCard, UpdateCard } from "../types/card.type";
import { boards, cards } from "@/db/schema";
import { and, asc, count, eq, gte, isNull, lte, sql } from "drizzle-orm";

export const cardRepository = {
  createWithMembersCardLabels: async (data: NewCard) => {
    const [insert] = await db
      .insert(cards)
      .values(data)
      .returning({ id: cards.id });

    return db.query.cards.findFirst({
      where: eq(cards.id, insert.id),
      extras: {
        attachmentsCount: sql<number>`
        (
          select count(*) 
          from attachments 
          where attachments.card_id = ${cards.id}
        )
      `.as("attachmentsCount"),
        commentsCount: sql<number>`
        (
          select count(*) 
          from comments 
          where comments.card_id = ${cards.id}
            and comments.parent_id is null
        )
      `.as("commentsCount"),
        checklistsCount: sql<number>`
        (
          select count(*) 
          from checklists
          where checklists.card_id = ${cards.id}
        )
      `.as("checklistsCount"),
      },
      with: {
        members: {
          with: {
            user: true,
          },
        },

        cardLabels: {
          with: {
            label: true,
          },
        },
      },
    });
  },

  create: async (data: NewCard) => {
    const [card] = await db.insert(cards).values(data).returning();
    return card;
  },

  findByIdWithBoard: async (cardId: string) => {
    return db.query.cards.findFirst({
      where: eq(cards.id, cardId),
      with: {
        board: {
          columns: {
            workspaceId: true,
          },
        },
      },
    });
  },

  countByBoardId: async (boardId: string): Promise<number> => {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(cards)
      .where(eq(cards.boardId, boardId));

    return Number(result[0].count);
  },

  findByIdWithBoardMembers: async (cardId: string) => {
    return db.query.cards.findFirst({
      where: eq(cards.id, cardId),
      with: {
        members: true,
        board: true,
      },
    });
  },

  findByIdWithBoardCardLabelsChecklistsAttachments: async (cardId: string) => {
    return db.query.cards.findFirst({
      where: eq(cards.id, cardId),
      with: {
        board: true,
        cardLabels: true,
        checklists: {
          with: {
            items: true,
          },
        },
        attachments: true,
      },
    });
  },

  findByIdWithBoardMembersChecklistsCommentsAttachmentsActivitiesAndCardLabels:
    async (cardId: string) => {
      return db.query.cards.findFirst({
        where: eq(cards.id, cardId),
        with: {
          // list: true,
          board: true,
          // labels: {
          //   with: {
          //     label: true,
          //   },
          // },
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
                  reactions: {
                    with: { user: true },
                  },
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
          cardLabels: {
            with: {
              label: true,
            },
          },
        },
      });
    },

  update: async (cardId: string, data: UpdateCard) => {
    const [updated] = await db
      .update(cards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cards.id, cardId))
      .returning();
    return updated;
  },

  delete: async (cardId: string) => {
    await db.delete(cards).where(eq(cards.id, cardId));
  },

  getMaxPosition: async (listId: string) => {
    const result = await db.query.cards.findMany({
      where: eq(cards.listId, listId),
      orderBy: (cards, { desc }) => [desc(cards.position)],
      limit: 1,
    });
    return result[0]?.position ?? -1;
  },

  reorders: async (
    listId: string,
    orders: { id: string; position: number }[],
  ) => {
    await db.transaction(async (tx) => {
      for (const { id, position } of orders) {
        await tx
          .update(cards)
          .set({ position, updatedAt: new Date() })
          .where(and(eq(cards.id, id), eq(cards.listId, listId)));
      }
    });
  },

  moveToList: async (
    cardId: string,
    destinationListId: string,
    boardId: string,
  ) => {
    return db
      .update(cards)
      .set({
        listId: destinationListId,
        boardId,
        updatedAt: new Date(),
      })
      .where(eq(cards.id, cardId))
      .returning();
  },

  findAllByListId: async (listId: string) => {
    return db.query.cards.findMany({
      where: eq(cards.listId, listId),
      orderBy: [asc(cards.position)],
    });
  },

  getTotalCardsByWorksapceId: async (workspaceId: string) => {
    const [result] = await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(eq(boards.workspaceId, workspaceId), eq(cards.isArchived, false)),
      );
    return result.count;
  },

  getCompletedCardsByWorkspaceId: async (workspaceId: string) => {
    const [result] = await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(eq(boards.workspaceId, workspaceId), eq(cards.isArchived, true)),
      );
    return result.count;
  },

  getOverdueCardsByWorkspaceId: async (workspaceId: string, now: Date) => {
    const [result] = await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, false),
          lte(cards.dueDate, now),
        ),
      );
    return result.count;
  },

  getCardsCreatedSinceByWorkspaceId: async (
    workspaceId: string,
    fromDate: Date,
  ) => {
    const [result] = await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          gte(cards.createdAt, fromDate),
        ),
      );
    return result.count;
  },

  getCardsCreatedByWorkspaceIdAndDate: async (
    workspaceId: string,
    startDate: Date,
  ) => {
    return await db
      .select({
        date: sql<string>`DATE(${cards.createdAt})`,
        created: count(),
      })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          gte(cards.createdAt, startDate),
        ),
      )
      .groupBy(sql`DATE(${cards.createdAt})`)
      .orderBy(sql`DATE(${cards.createdAt})`);
  },

  getCardsCompletedByWorkspaceIdAndDate: async (
    workspaceId: string,
    startDate: Date,
  ) => {
    return await db
      .select({
        date: sql<string>`DATE(${cards.updatedAt})`,
        completed: count(),
      })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, true),
          gte(cards.updatedAt, startDate),
        ),
      )
      .groupBy(sql`DATE(${cards.updatedAt})`)
      .orderBy(sql`DATE(${cards.updatedAt})`);
  },

  getTotalCardsByBoardId: async (boardId: string) => {
    const [res] = await db
      .select({ count: count() })
      .from(cards)
      .where(and(eq(cards.boardId, boardId), eq(cards.isArchived, false)));
    return res.count;
  },

  getCompletedCardsByBoardId: async (boardId: string) => {
    const [res] = await db
      .select({ count: count() })
      .from(cards)
      .where(and(eq(cards.boardId, boardId), eq(cards.isArchived, true)));
    return res.count;
  },

  getOverdueCardsByBoardId: async (boardId: string, now: Date) => {
    const [res] = await db
      .select({ count: count() })
      .from(cards)
      .where(
        and(
          eq(cards.boardId, boardId),
          eq(cards.isArchived, false),
          lte(cards.dueDate, now),
        ),
      );
    return res.count;
  },

  getCompletedCardsDatesByBoardId: async (boardId: string, limit = 100) => {
    return await db
      .select({ createdAt: cards.createdAt, updatedAt: cards.updatedAt })
      .from(cards)
      .where(and(eq(cards.boardId, boardId), eq(cards.isArchived, true)))
      .limit(limit);
  },

  getOverdueCardsCount: async (workspaceId: string, today: Date) => {
    return await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, false),
          lte(cards.dueDate, today),
        ),
      );
  },

  getDueTodayCardsCount: async (workspaceId: string, today: Date) => {
    return await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, false),
          sql`DATE(${cards.dueDate}) = DATE(${today})`,
        ),
      );
  },

  getDueThisWeekCardsCount: async (
    workspaceId: string,
    today: Date,
    weekFromNow: Date,
  ) => {
    return await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, false),
          gte(cards.dueDate, today),
          lte(cards.dueDate, weekFromNow),
        ),
      );
  },

  getDueThisMonthCardsCount: async (
    workspaceId: string,
    today: Date,
    monthFromNow: Date,
  ) => {
    return await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, false),
          gte(cards.dueDate, today),
          lte(cards.dueDate, monthFromNow),
        ),
      );
  },

  getNoDueDateCardsCount: async (workspaceId: string) => {
    return await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, false),
          sql`${cards.dueDate} IS NULL`,
        ),
      );
  },
};
