import { db } from "@/db";
import { NewComment, UpdateComment } from "../types/comment.type";
import { boards, cards, comments } from "@/db/schema";
import { and, count, eq, isNull } from "drizzle-orm";

export const commentRepository = {
  create: async (data: NewComment) => {
    const [inserted] = await db
      .insert(comments)
      .values(data)
      .returning({ id: comments.id });

    const comment = await commentRepository.findById(inserted.id);

    return comment;
  },

  findById: async (id: string) => {
    return await db.query.comments.findFirst({
      where: eq(comments.id, id),
      with: {
        user: true,
        replies: {
          with: {
            user: true,
            reactions: true,
          },
          orderBy: (comments, { asc }) => [asc(comments.createdAt)],
        },
        reactions: true,
      },
    });
  },

  findByCardId: async (cardId: string) => {
    return await db.query.comments.findMany({
      where: and(eq(comments.cardId, cardId), isNull(comments.parentId)),
      with: {
        user: true,
        replies: {
          with: {
            user: true,
            reactions: {
              with: { user: true },
            },
          },
          orderBy: (comments, { asc }) => [asc(comments.createdAt)],
        },
        reactions: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (comments, { asc }) => [asc(comments.createdAt)],
    });
  },

  update: async (id: string, data: UpdateComment) => {
    const [updated] = await db
      .update(comments)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, id))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(comments).where(eq(comments.id, id));
  },

  getCommentsCountByUserId: async (userId: string, workspaceId: string) => {
    const [res] = await db
      .select({ count: count() })
      .from(comments)
      .innerJoin(cards, eq(comments.cardId, cards.id))
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(eq(comments.userId, userId), eq(boards.workspaceId, workspaceId))
      );
    return res.count;
  },
};
