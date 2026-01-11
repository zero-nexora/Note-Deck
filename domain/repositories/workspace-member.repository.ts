import { db } from "@/db";
import { workspaceMembers } from "@/db/schema";
import { and, count, eq, sql } from "drizzle-orm";
import { NewWorkspaceMember } from "../types/workspace-member.type";
import { Role } from "@/lib/constants";

export const workspaceMemberRepository = {
  add: async (data: NewWorkspaceMember) => {
    const [member] = await db.insert(workspaceMembers).values(data).returning();
    return member;
  },

  findByWorkspaceIdAndUserId: async (workspaceId: string, userId: string) => {
    return db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });
  },

  findByWorkspaceIdWithUser: async (workspaceId: string) => {
    return db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.workspaceId, workspaceId),
      with: {
        user: true,
      },
      orderBy: (workspaceMembers, { asc }) => [asc(workspaceMembers.createdAt)],
    });
  },

  updateRole: async (workspaceId: string, userId: string, role: Role) => {
    const [updated] = await db
      .update(workspaceMembers)
      .set({ role })
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .returning();
    return updated;
  },

  remove: async (workspaceId: string, userId: string) => {
    await db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      );
  },

  toggleGuest: async (
    workspaceId: string,
    userId: string,
    isGuest: boolean
  ) => {
    const [updated] = await db
      .update(workspaceMembers)
      .set({ isGuest })
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .returning();
    return updated;
  },

  getTotalMembersByWorkspaceId: async (workspaceId: string) => {
    const [result] = await db
      .select({ count: count() })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId));
    return result.count;
  },

  getMembersByWorkspaceId: async (workspaceId: string) => {
    return db
      .select({
        userId: workspaceMembers.userId,
        userName: sql<string>`users.name`,
        userEmail: sql<string>`users.email`,
        userImage: sql<string | null>`users.image`,
      })
      .from(workspaceMembers)
      .innerJoin(sql`users`, sql`users.id = ${workspaceMembers.userId}`)
      .where(eq(workspaceMembers.workspaceId, workspaceId));
  },
};
