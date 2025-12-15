import { db } from "@/db";
import { NewWorkspaceMember } from "../types/workspace-member.type";
import { workspaceMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Role } from "@/db/enum";

export const workspaceMemberRepository = {
  add: async (data: NewWorkspaceMember) => {
    const [member] = await db.insert(workspaceMembers).values(data).returning();
    return member;
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

  updateMemberRole: async (workspaceId: string, userId: string, role: Role) => {
    const [updatedMember] = await db
      .update(workspaceMembers)
      .set({ role })
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .returning();

    return updatedMember;
  },
};
