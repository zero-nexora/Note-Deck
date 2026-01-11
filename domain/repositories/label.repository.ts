import { db } from "@/db";
import { NewLabel, UpdateLabel } from "../types/label.type";
import { boards, cardLabels, labels } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export const labelRepository = {
  create: async (data: NewLabel) => {
    const [label] = await db.insert(labels).values(data).returning();
    return label;
  },

  findByBoardId: async (boardId: string) => {
    return db.query.labels.findMany({
      where: eq(labels.boardId, boardId),
      orderBy: (labels, { asc }) => [asc(labels.name)],
    });
  },

  findById: async (labelId: string) => {
    return db.query.labels.findFirst({
      where: eq(labels.id, labelId),
    });
  },

  update: async (labelId: string, data: UpdateLabel) => {
    const [updated] = await db
      .update(labels)
      .set(data)
      .where(eq(labels.id, labelId))
      .returning();
    return updated;
  },

  delete: async (labelId: string) => {
    await db.delete(labels).where(eq(labels.id, labelId));
  },

  getLabelDataByWorkspaceId: async (workspaceId: string) => {
    return db
      .select({
        labelId: labels.id,
        labelName: labels.name,
        labelColor: labels.color,
        cardsCount: count(cardLabels.id),
      })
      .from(labels)
      .innerJoin(boards, eq(labels.boardId, boards.id))
      .leftJoin(cardLabels, eq(cardLabels.labelId, labels.id))
      .where(eq(boards.workspaceId, workspaceId))
      .groupBy(labels.id, labels.name, labels.color)
      .orderBy(desc(count(cardLabels.id)));
  },
};
