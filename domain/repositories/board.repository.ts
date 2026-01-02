import { db } from "@/db";
import { NewBoard, UpdateBoard } from "../types/board.type";
import { boards, cards, comments, lists } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const boardRepository = {
  create: async (data: NewBoard) => {
    const [board] = await db.insert(boards).values(data).returning();
    return board;
  },

  findById: async (id: string) => {
    return await db.query.boards.findFirst({
      where: and(eq(boards.id, id), eq(boards.isArchived, false)),
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
              with: {
                members: {
                  with: {
                    user: true,
                  },
                },
                attachments: true,
                comments: {
                  where: isNull(comments.parentId),
                  with: {
                    replies: {
                      with: {
                        user: true,
                        reactions: true,
                      },
                      orderBy: (comments, { asc }) => [asc(comments.createdAt)],
                    },
                    user: true,
                    reactions: true,
                  },
                },
                checklists: {
                  with: {
                    items: true,
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

  findByWorkspaceId: async (workspaceId: string, includeArchived = false) => {
    const query = includeArchived
      ? eq(boards.workspaceId, workspaceId)
      : and(eq(boards.workspaceId, workspaceId), eq(boards.isArchived, false));

    const workspaceBoards = await db.query.boards.findMany({
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
    return workspaceBoards;
  },

  update: async (id: string, data: UpdateBoard) => {
    const [updated] = await db
      .update(boards)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(boards.id, id))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(boards).where(eq(boards.id, id));
  },
};
