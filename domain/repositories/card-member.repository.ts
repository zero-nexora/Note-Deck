import { db } from "@/db";
import { cardMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { AddCardMemberInput } from "../schemas/card-member.schema";

export const cardMemberRepository = {
  add: async (data: AddCardMemberInput) => {
    const [member] = await db.insert(cardMembers).values(data).returning();

    return member;
  },

  findByCardId: async (cardId: string, userId: string) => {
    return await db.query.cardMembers.findFirst({
      where: and(
        eq(cardMembers.cardId, cardId),
        eq(cardMembers.userId, userId)
      ),
    });
  },

  findByCardIdAndUserId: async (cardId: string, userId: string) => {
    const member = await db.query.cardMembers.findFirst({
      where: and(
        eq(cardMembers.cardId, cardId),
        eq(cardMembers.userId, userId)
      ),
    });
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
