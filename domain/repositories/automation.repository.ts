import { db } from "@/db";
import { NewAutomation, UpdateAutomation } from "../types/automation.type";
import { automations } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const automationRepository = {
  create: async (data: NewAutomation) => {
    const [automation] = await db.insert(automations).values(data).returning();
    return automation;
  },

  findByBoardId: async (boardId: string, activeOnly = false) => {
    const query = activeOnly
      ? and(eq(automations.boardId, boardId), eq(automations.isActive, true))
      : eq(automations.boardId, boardId);

    const boardAutomations = await db.query.automations.findMany({
      where: query,
      orderBy: [desc(automations.createdAt)],
    });
    return boardAutomations;
  },

  findById: async (id: string) => {
    const automation = await db.query.automations.findFirst({
      where: eq(automations.id, id),
    });
    return automation;
  },

  update: async (id: string, data: UpdateAutomation) => {
    const [updated] = await db
      .update(automations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(automations.id, id))
      .returning();
    return updated;
  },

  enable: async (id: string) => {
    const [updated] = await db
      .update(automations)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(automations.id, id))
      .returning();
    return updated;
  },

  disable: async (id: string) => {
    const [updated] = await db
      .update(automations)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(automations.id, id))
      .returning();
    return updated;
  },

  delete: async (id: string) => {
    await db.delete(automations).where(eq(automations.id, id));
  },
};
