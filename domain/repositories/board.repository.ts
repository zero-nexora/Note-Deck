import { db } from "@/db";
import { NewBoard, UpdateBoard } from "../types/board.type";
import { boards, cards, lists } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const boardRepository = {
  create: async (data: NewBoard) => {
    const [board] = await db.insert(boards).values(data).returning();

    return board;
  },

  findById: async (id: string) => {
    return await db.query.boards.findFirst({
      where: eq(boards.id, id),
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
              },
            },
          },
        },
        labels: true,
      },
    });
  },

  findByWorkspaceId: async (workspaceId: string) => {
    return await db.query.boards.findMany({
      where: and(
        eq(boards.workspaceId, workspaceId),
        eq(boards.isArchived, false)
      ),
      orderBy: (boards, { desc }) => [desc(boards.updatedAt)],
    });
  },

  update: async (data: UpdateBoard) => {
    const [updated] = await db
      .update(boards)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(boards.id, data.id!))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(boards).where(eq(boards.id, id));
  },

  archive: async (id: string) => {
    return boardRepository.update({ id, isArchived: true });
  },
};
