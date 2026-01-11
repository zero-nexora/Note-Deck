import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NewCommentReaction } from "../types/comment-reaction.type";

export const commentReactionRepository = {
  add: async (data: NewCommentReaction) => {
    const [inserted] = await db
      .insert(commentReactions)
      .values(data)
      .returning({
        id: commentReactions.id,
      });

    const reaction = await db.query.commentReactions.findFirst({
      where: eq(commentReactions.id, inserted.id),
      with: {
        user: true,
      },
    });

    return reaction;
  },

  // findByCommentId: async (commentId: string) => {
  //   return db.query.commentReactions.findMany({
  //     where: eq(commentReactions.commentId, commentId),
  //   });
  // },

  // findByCommentIdWithUser: async (commentId: string) => {
  //   const reactions = await db.query.commentReactions.findMany({
  //     where: eq(commentReactions.commentId, commentId),
  //     with: {
  //       user: true,
  //     },
  //   });
  //   return reactions;
  // },

  findByCommentIdUserEmoji: async (
    commentId: string,
    userId: string,
    emoji: string
  ) => {
    return db.query.commentReactions.findFirst({
      where: and(
        eq(commentReactions.commentId, commentId),
        eq(commentReactions.userId, userId),
        eq(commentReactions.emoji, emoji)
      ),
    });
  },

  remove: async (commentId: string, userId: string, emoji: string) => {
    await db
      .delete(commentReactions)
      .where(
        and(
          eq(commentReactions.commentId, commentId),
          eq(commentReactions.userId, userId),
          eq(commentReactions.emoji, emoji)
        )
      );
  },
};
