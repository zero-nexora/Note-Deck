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

  findByWorkspaceAndUser: async (workspaceId: string, userId: string) => {
    return db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });
  },

  findMembersByWorkspaceId: async (workspaceId: string) => {
    return db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.workspaceId, workspaceId),
      with: {
        user: true,
      },
    });
  },

  update: async (
    workspaceId: string,
    userId: string,
    data: { role?: Role; isGuest?: boolean }
  ) => {
    const [updated] = await db
      .update(workspaceMembers)
      .set(data)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .returning();
    return updated;
  },

  delete: async (workspaceId: string, userId: string) => {
    await db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      );
  },
};
