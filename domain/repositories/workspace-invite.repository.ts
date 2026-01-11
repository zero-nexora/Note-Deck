import { db } from "@/db";
import { NewWorkspaceInvite } from "../types/workspace-invite.type";
import { workspaceInvites } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const workspaceInviteRepository = {
  create: async (data: NewWorkspaceInvite) => {
    const [invite] = await db.insert(workspaceInvites).values(data).returning();
    return invite;
  },

  findById: async (inviteId: string) => {
    return db.query.workspaceInvites.findFirst({
      where: eq(workspaceInvites.id, inviteId),
    });
  },

  findByToken: async (token: string) => {
    return db.query.workspaceInvites.findFirst({
      where: eq(workspaceInvites.token, token),
    });
  },

  findByWorkspaceIdAndEmail: async (workspaceId: string, email: string) => {
    return db.query.workspaceInvites.findFirst({
      where: and(
        eq(workspaceInvites.workspaceId, workspaceId),
        eq(workspaceInvites.email, email)
      ),
    });
  },

  findByWorkspaceId: async (workspaceId: string, pendingOnly = false) => {
    const now = new Date();

    return db.query.workspaceInvites.findMany({
      where: (workspaceInvites, { eq, and, isNull, gt }) =>
        pendingOnly
          ? and(
              eq(workspaceInvites.workspaceId, workspaceId),
              isNull(workspaceInvites.acceptedAt),
              gt(workspaceInvites.expiresAt, now)
            )
          : eq(workspaceInvites.workspaceId, workspaceId),
      orderBy: (workspaceInvites, { desc }) => [
        desc(workspaceInvites.createdAt),
      ],
    });
  },

  accept: async (inviteId: string) => {
    const [updated] = await db
      .update(workspaceInvites)
      .set({ acceptedAt: new Date() })
      .where(eq(workspaceInvites.id, inviteId))
      .returning();
    return updated;
  },

  updateExpiry: async (inviteId: string, expiresAt: Date) => {
    const [updated] = await db
      .update(workspaceInvites)
      .set({ expiresAt })
      .where(eq(workspaceInvites.id, inviteId))
      .returning();
    return updated;
  },

  revoke: async (inviteId: string) => {
    await db.delete(workspaceInvites).where(eq(workspaceInvites.id, inviteId));
  },
};
