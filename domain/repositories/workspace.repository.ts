import { db } from "@/db";
import {
  NewWorkspace,
  UpdateWorkspace,
  Workspace,
} from "../types/workspace.type";
import { workspaceMembers, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { workspaceMemberRepository } from "./workspace-member.repository";

export const workspaceRepository = {
  create: async (data: NewWorkspace): Promise<Workspace> => {
    const [workspace] = await db.insert(workspaces).values(data).returning();

    await workspaceMemberRepository.add({
      workspaceId: workspace.id,
      userId: data.ownerId,
      role: "admin",
    });

    return workspace;
  },

  findById: async (id: string) => {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });

    return workspace;
  },

  findByUserId: async (userId: string) => {
    const memberships = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.userId, userId),
      with: {
        workspace: {
          with: {
            owner: true,
            members: true,
          }
        },
      },
    });

    return memberships.map((membership) => membership.workspace);
  },

  findBySlug: async (slug: string) => {
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    });

    return workspace;
  },

  update: async (id: string, data: UpdateWorkspace) => {
    const [updated] = await db
      .update(workspaces)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, id))
      .returning();

    return updated;
  },

  updateByStripeSubscriptionId: async (data: UpdateWorkspace) => {
    const [updated] = await db
      .update(workspaces)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.stripeSubscriptionId, data.stripeSubscriptionId!))
      .returning();

    return updated;
  },

  delete: async (id: string) => {
    await db.delete(workspaces).where(eq(workspaces.id, id));
  },
};
