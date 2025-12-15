import { db } from "@/db";
import { cardMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const cardMemberRepository = {
  add: async (cardId: string, userId: string) => {
    const [member] = await db
      .insert(cardMembers)
      .values({ cardId, userId })
      .returning();

    return member;
  },

  remove: async (cardId: string, userId: string) => {
    await db
      .delete(cardMembers)
      .where(
        and(eq(cardMembers.cardId, cardId), eq(cardMembers.userId, userId))
      );
  },
};
