import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NewCommentReaction } from "../types/comment-reaction.type";

export const commentReactionRepository = {
  add: async (data: NewCommentReaction) => {
    const [reaction] = await db
      .insert(commentReactions)
      .values(data)
      .returning();

    return reaction;
  },

  findByCommentId: async (commentId: string) => {
    const reactions = await db.query.commentReactions.findMany({
      where: eq(commentReactions.commentId, commentId),
      with: {
        user: true,
      },
    });
    return reactions;
  },

  findByCommentUserEmoji: async (
    commentId: string,
    userId: string,
    emoji: string
  ) => {
    const reaction = await db.query.commentReactions.findFirst({
      where: and(
        eq(commentReactions.commentId, commentId),
        eq(commentReactions.userId, userId),
        eq(commentReactions.emoji, emoji)
      ),
    });
    return reaction;
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
