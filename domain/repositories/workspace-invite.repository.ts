import { db } from "@/db";
import { NewWorkspaceInvite } from "../types/workspace-invite.type";
import { workspaceInvites } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const workspaceInviteRepository = {
  create: async (data: NewWorkspaceInvite) => {
    const [invite] = await db.insert(workspaceInvites).values(data).returning();
    return invite;
  },

  findById: async (id: string) => {
    const invite = await db.query.workspaceInvites.findFirst({
      where: eq(workspaceInvites.id, id),
    });
    return invite;
  },

  findByToken: async (token: string) => {
    const invite = await db.query.workspaceInvites.findFirst({
      where: eq(workspaceInvites.token, token),
    });
    return invite;
  },

  findByWorkspaceIdAndEmail: async (workspaceId: string, email: string) => {
    const invite = await db.query.workspaceInvites.findFirst({
      where: and(
        eq(workspaceInvites.workspaceId, workspaceId),
        eq(workspaceInvites.email, email)
      ),
    });
    return invite;
  },

  findByWorkspaceId: async (workspaceId: string, pendingOnly = false) => {
    const now = new Date();

    const invites = await db.query.workspaceInvites.findMany({
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

    return invites;
  },

  accept: async (id: string) => {
    const [updated] = await db
      .update(workspaceInvites)
      .set({ acceptedAt: new Date() })
      .where(eq(workspaceInvites.id, id))
      .returning();
    return updated;
  },

  updateExpiry: async (id: string, expiresAt: Date) => {
    const [updated] = await db
      .update(workspaceInvites)
      .set({ expiresAt })
      .where(eq(workspaceInvites.id, id))
      .returning();
    return updated;
  },

  revoke: async (id: string) => {
    await db.delete(workspaceInvites).where(eq(workspaceInvites.id, id));
  },
};
