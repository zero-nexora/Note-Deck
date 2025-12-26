import { db } from "@/db";
import { Role } from "@/db/enum";
import { boardMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NewBoardMember } from "../types/board-member.type";

export const boardMemberRepository = {
  add: async (data: NewBoardMember) => {
    const [member] = await db.insert(boardMembers).values(data).returning();

    return member;
  },

  findByBoardId: async (boardId: string) => {
    const members = await db.query.boardMembers.findMany({
      where: eq(boardMembers.boardId, boardId),
      with: {
        user: true,
      },
    });
    return members;
  },

  findByBoardIdAndUserId: async (boardId: string, userId: string) => {
    const member = await db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, userId)
      ),
    });
    return member;
  },

  remove: async (boardId: string, userId: string) => {
    await db
      .delete(boardMembers)
      .where(
        and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId))
      );
  },

  updateRole: async (boardId: string, userId: string, role: Role) => {
    const [updated] = await db
      .update(boardMembers)
      .set({ role })
      .where(
        and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId))
      )
      .returning();
    return updated;
  },
};
