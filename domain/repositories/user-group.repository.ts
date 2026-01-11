import { db } from "@/db";
import { userGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NewUserGroup, UpdateUserGroup } from "../types/user-group.type";

export const userGroupRepository = {
  create: async (data: NewUserGroup) => {
    const [group] = await db.insert(userGroups).values(data).returning();
    return group;
  },

  findById: async (groupId: string) => {
    return db.query.userGroups.findFirst({
      where: eq(userGroups.id, groupId),
    });
  },

  findByIdWithMembers: async (groupId: string) => {
    return db.query.userGroups.findFirst({
      where: eq(userGroups.id, groupId),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
  },

  findByWorkspaceIdWithMembers: async (workspaceId: string) => {
    return db.query.userGroups.findMany({
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
  },

  update: async (groupId: string, data: UpdateUserGroup) => {
    const [updated] = await db
      .update(userGroups)
      .set(data)
      .where(eq(userGroups.id, groupId))
      .returning();
    return updated;
  },

  delete: async (groupId: string) => {
    await db.delete(userGroups).where(eq(userGroups.id, groupId));
  },
};
