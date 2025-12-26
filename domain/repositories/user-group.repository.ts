import { db } from "@/db";
import { userGroups } from "@/db/schema";
import { eq } from "drizzle-orm";

export const userGroupRepository = {
  create: async (data: {
    workspaceId: string;
    name: string;
    permissions: any;
  }) => {
    const [group] = await db.insert(userGroups).values(data).returning();
    return group;
  },

  findById: async (id: string) => {
    const group = await db.query.userGroups.findFirst({
      where: eq(userGroups.id, id),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
    return group;
  },

  findByWorkspaceId: async (workspaceId: string) => {
    const groups = await db.query.userGroups.findMany({
      where: eq(userGroups.workspaceId, workspaceId),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (userGroups, { asc }) => [asc(userGroups.name)],
    });
    return groups;
  },

  update: async (id: string, data: { name?: string; permissions?: any }) => {
    const [updated] = await db
      .update(userGroups)
      .set(data)
      .where(eq(userGroups.id, id))
      .returning();
    return updated;
  },

  delete: async (id: string) => {
    await db.delete(userGroups).where(eq(userGroups.id, id));
  },
};
