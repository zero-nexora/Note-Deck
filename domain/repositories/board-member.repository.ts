import { db } from "@/db";
import { Role } from "@/db/enum";
import { boardMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const boardMemberRepository = {
  addMember: async (boardId: string, userId: string, role: Role) => {
    const [member] = await db
      .insert(boardMembers)
      .values({ boardId, userId, role })
      .returning();

    return member;
  },

  removeMember: async (boardId: string, userId: string) => {
    await db
      .delete(boardMembers)
      .where(
        and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId))
      );
  },

  updateMemberRole: async (boardId: string, userId: string, role: Role) => {
    const [updatedMember] = await db
      .update(boardMembers)
      .set({ role })
      .where(
        and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, userId))
      )
      .returning();
    return updatedMember;
  },
};
