import { db } from "@/db";
import { boards, cardMembers, cards } from "@/db/schema";
import { and, count, eq } from "drizzle-orm";
import { AddCardMemberInput } from "../schemas/card-member.schema";

export const cardMemberRepository = {
  add: async (data: AddCardMemberInput) => {
    const [member] = await db.insert(cardMembers).values(data).returning();

    return member;
  },

  findByCardIdAndUserId: async (cardId: string, userId: string) => {
    return db.query.cardMembers.findFirst({
      where: and(
        eq(cardMembers.cardId, cardId),
        eq(cardMembers.userId, userId)
      ),
    });
  },

  remove: async (cardId: string, userId: string) => {
    await db
      .delete(cardMembers)
      .where(
        and(eq(cardMembers.cardId, cardId), eq(cardMembers.userId, userId))
      );
  },

  getAssignedCardsByUserId: async (userId: string, workspaceId: string) => {
    const [res] = await db
      .select({ count: count() })
      .from(cardMembers)
      .innerJoin(cards, eq(cardMembers.cardId, cards.id))
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(cardMembers.userId, userId),
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, false)
        )
      );
    return res.count;
  },

  getCompletedCardsByUserId: async (userId: string, workspaceId: string) => {
    const [res] = await db
      .select({ count: count() })
      .from(cardMembers)
      .innerJoin(cards, eq(cardMembers.cardId, cards.id))
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(cardMembers.userId, userId),
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, true)
        )
      );
    return res.count;
  },
};
