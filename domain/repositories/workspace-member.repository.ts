import { db } from "@/db";
import { workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NewWorkspaceMember } from "../types/workspace-member.type";
import { Role } from "@/db/enum";

export const workspaceMemberRepository = {
  add: async (data: NewWorkspaceMember) => {
    const [member] = await db.insert(workspaceMembers).values(data).returning();
    return member;
  },

  findByWorkspaceIdAndUserId: async (workspaceId: string, userId: string) => {
    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });
    return member;
  },

  findByWorkspaceId: async (workspaceId: string) => {
    const members = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.workspaceId, workspaceId),
      with: {
        user: true,
      },
      orderBy: (workspaceMembers, { asc }) => [asc(workspaceMembers.createdAt)],
    });
    return members;
  },

  findMembersByWorkspaceId: async (workspaceId: string) => {
    return db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.workspaceId, workspaceId),
      with: {
        user: true,
      },
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
};
