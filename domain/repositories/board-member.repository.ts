import { db } from "@/db";
import { boardMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NewBoardMember } from "../types/board-member.type";
import { Role } from "@/lib/constants";

export const boardMemberRepository = {
  add: async (data: NewBoardMember) => {
    const [member] = await db.insert(boardMembers).values(data).returning();

    return member;
  },

  findByBoardId: async (boardId: string) => {
    return db.query.boardMembers.findMany({
      where: eq(boardMembers.boardId, boardId),
      with: {
        user: true,
      },
    });
  },

  findByBoardIdWithUser: async (boardId: string) => {
    return db.query.boardMembers.findMany({
      where: eq(boardMembers.boardId, boardId),
      with: {
        user: true,
      },
    });
  },

  findByBoardIdAndUserId: async (boardId: string, userId: string) => {
    return db.query.boardMembers.findFirst({
      where: and(
        eq(boardMembers.boardId, boardId),
        eq(boardMembers.userId, userId)
      ),
    });
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
