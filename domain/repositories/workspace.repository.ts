import { db } from "@/db";
import { NewWorkspace, UpdateWorkspace } from "../types/workspace.type";
import {
  boards,
  cards,
  checklistItems,
  checklists,
  lists,
  workspaceMembers,
  workspaces,
} from "@/db/schema";
import { and, count, eq } from "drizzle-orm";

export const workspaceRepository = {
  create: async (data: NewWorkspace) => {
    const [workspace] = await db.insert(workspaces).values(data).returning();
    return workspace;
  },

  findById: async (workspaceId: string) => {
    return db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });
  },

  findByIdWithOwnerAndMembers: async (workspaceId: string) => {
    return db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      with: {
        owner: true,
        members: {
          with: {
            user: true,
          },
        },
      },
    });
  },

  findByUserIdWithOwnerAndMembers: async (userId: string) => {
    const memberships = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.userId, userId),
      with: {
        workspace: {
          with: {
            owner: true,
            members: true,
          },
        },
      },
    });

    return memberships.map((membership) => membership.workspace);
  },

  update: async (workspaceId: string, data: UpdateWorkspace) => {
    const [updated] = await db
      .update(workspaces)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, workspaceId))
      .returning();
    return updated;
  },

  updateOwner: async (workspaceId: string, newOwnerId: string) => {
    const [workspace] = await db
      .update(workspaces)
      .set({ ownerId: newOwnerId })
      .where(eq(workspaces.id, workspaceId))
      .returning();

    return workspace;
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

  delete: async (workspaceId: string) => {
    await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
  },

  getTotalBoards: async (workspaceId: string) => {
    const result = await db
      .select({ count: count() })
      .from(boards)
      .where(
        and(eq(boards.workspaceId, workspaceId), eq(boards.isArchived, false))
      );
    return result[0]?.count ?? 0;
  },

  getTotalLists: async (workspaceId: string) => {
    const result = await db
      .select({ count: count() })
      .from(lists)
      .innerJoin(boards, eq(lists.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(lists.isArchived, false),
          eq(boards.isArchived, false)
        )
      );
    return result[0]?.count ?? 0;
  },

  getTotalCards: async (workspaceId: string) => {
    const result = await db
      .select({ count: count() })
      .from(cards)
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(cards.isArchived, false),
          eq(boards.isArchived, false)
        )
      );
    return result[0]?.count ?? 0;
  },

  getCompletionRate: async (workspaceId: string) => {
    const totalItems = await db
      .select({ count: count() })
      .from(checklistItems)
      .innerJoin(checklists, eq(checklistItems.checklistId, checklists.id))
      .innerJoin(cards, eq(checklists.cardId, cards.id))
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(eq(boards.workspaceId, workspaceId), eq(boards.isArchived, false))
      );

    const completedItems = await db
      .select({ count: count() })
      .from(checklistItems)
      .innerJoin(checklists, eq(checklistItems.checklistId, checklists.id))
      .innerJoin(cards, eq(checklists.cardId, cards.id))
      .innerJoin(boards, eq(cards.boardId, boards.id))
      .where(
        and(
          eq(boards.workspaceId, workspaceId),
          eq(checklistItems.isCompleted, true),
          eq(boards.isArchived, false)
        )
      );

    const total = Number(totalItems[0]?.count ?? 0);
    const completed = Number(completedItems[0]?.count ?? 0);

    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  },

  getActiveMembers: async (workspaceId: string) => {
    const result = await db
      .select({ count: count() })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId));
    return result[0]?.count ?? 0;
  },
};
