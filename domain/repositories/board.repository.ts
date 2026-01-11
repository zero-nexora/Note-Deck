import { db } from "@/db";
import { NewBoard, UpdateBoard } from "../types/board.type";
import { boards, cards, comments, lists } from "@/db/schema";
import { and, count, eq, isNull, sql } from "drizzle-orm";

export const boardRepository = {
  create: async (data: NewBoard) => {
    const [board] = await db.insert(boards).values(data).returning();
    return board;
  },

  findById: async (boardId: string) => {
    return db.query.boards.findFirst({
      where: and(eq(boards.id, boardId), eq(boards.isArchived, false)),
    });
  },

  findByWorkspaceId: async (workspaceId: string, includeArchived = false) => {
    const query = includeArchived
      ? eq(boards.workspaceId, workspaceId)
      : and(eq(boards.workspaceId, workspaceId), eq(boards.isArchived, false));

    return db.query.boards.findMany({
      where: query,
    });
  },

  findByIdWithWorkspaceMembersListsAndLabels: async (boardId: string) => {
    return db.query.boards.findFirst({
      where: and(eq(boards.id, boardId), eq(boards.isArchived, false)),
      with: {
        workspace: true,

        members: {
          with: {
            user: true,
          },
        },

        lists: {
          where: eq(lists.isArchived, false),
          orderBy: (lists, { asc }) => [asc(lists.position)],
          with: {
            cards: {
              where: eq(cards.isArchived, false),
              orderBy: (cards, { asc }) => [asc(cards.position)],

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
            },
          },
        },

        labels: true,
      },
    });
  },

  // findByIdWithWorkspaceMembersListsAndLabels: async (boardId: string) => {
  //   return db.query.boards.findFirst({
  //     where: and(eq(boards.id, boardId), eq(boards.isArchived, false)),
  //     with: {
  //       workspace: true,
  //       members: {
  //         with: {
  //           user: true,
  //         },
  //       },
  //       lists: {
  //         where: eq(lists.isArchived, false),
  //         orderBy: (lists, { asc }) => [asc(lists.position)],
  //         with: {
  //           cards: {
  //             where: eq(cards.isArchived, false),
  //             orderBy: (cards, { asc }) => [asc(cards.position)],
  //             with: {
  //               members: {
  //                 with: {
  //                   user: true,
  //                 },
  //               },
  //               attachments: true,
  //               comments: {
  //                 where: isNull(comments.parentId),
  //                 with: {
  //                   replies: {
  //                     with: {
  //                       user: true,
  //                       reactions: {
  //                         with: {
  //                           user: true,
  //                         },
  //                       },
  //                     },
  //                     orderBy: (comments, { asc }) => [asc(comments.createdAt)],
  //                   },
  //                   user: true,
  //                   reactions: {
  //                     with: {
  //                       user: true,
  //                     },
  //                   },
  //                 },
  //               },
  //               checklists: {
  //                 with: {
  //                   items: true,
  //                 },
  //               },
  //               cardLabels: {
  //                 with: {
  //                   label: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       labels: true,
  //     },
  //   });
  // },

  findByWorkspaceIdWithMembers: async (
    workspaceId: string,
    includeArchived = false
  ) => {
    const query = includeArchived
      ? eq(boards.workspaceId, workspaceId)
      : and(eq(boards.workspaceId, workspaceId), eq(boards.isArchived, false));

    return db.query.boards.findMany({
      where: query,
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    });
  },

  update: async (boardId: string, data: UpdateBoard) => {
    const [updated] = await db
      .update(boards)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(boards.id, boardId))
      .returning();

    return updated;
  },

  delete: async (boardId: string) => {
    await db.delete(boards).where(eq(boards.id, boardId));
  },

  getTotalBoardsByWorkspaceId: async (workspaceId: string) => {
    const [result] = await db
      .select({ count: count() })
      .from(boards)
      .where(
        and(eq(boards.workspaceId, workspaceId), eq(boards.isArchived, false))
      );
    return result.count;
  },

  getBoardsByWorkspaceId: async (workspaceId: string) => {
    return db
      .select({
        id: boards.id,
        name: boards.name,
      })
      .from(boards)
      .where(
        and(eq(boards.workspaceId, workspaceId), eq(boards.isArchived, false))
      );
  },
};
