import { db } from "@/db";
import { userGroupMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const userGroupMemberRepository = {
  add: async (data: { groupId: string; userId: string }) => {
    const [member] = await db.insert(userGroupMembers).values(data).returning();
    return member;
  },

  findByGroupId: async (groupId: string) => {
    return db.query.userGroupMembers.findMany({
      where: eq(userGroupMembers.groupId, groupId),
    });
  },

  findByGroupIdWithUser: async (groupId: string) => {
    return db.query.userGroupMembers.findMany({
      where: eq(userGroupMembers.groupId, groupId),
      with: {
        user: true,
      },
    });
  },

  findByGroupIdAndUserId: async (groupId: string, userId: string) => {
    const member = await db.query.userGroupMembers.findFirst({
      where: and(
        eq(userGroupMembers.groupId, groupId),
        eq(userGroupMembers.userId, userId)
      ),
    });
    return member;
  },

  remove: async (groupId: string, userId: string) => {
    await db
      .delete(userGroupMembers)
      .where(
        and(
          eq(userGroupMembers.groupId, groupId),
          eq(userGroupMembers.userId, userId)
        )
      );
  },
};
