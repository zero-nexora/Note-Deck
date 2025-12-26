import { db } from "@/db";
import { cardLabels } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NewCardLabel } from "../types/card-label.type";

export const cardLabelRepository = {
  add: async (data: NewCardLabel) => {
    const [label] = await db.insert(cardLabels).values(data).returning();

    return label;
  },

  findByCardId: async (cardId: string) => {
    const labels = await db.query.cardLabels.findMany({
      where: eq(cardLabels.cardId, cardId),
      with: {
        label: true,
      },
    });
    return labels;
  },

  findByCardIdAndLabelId: async (cardId: string, labelId: string) => {
    return await db.query.cardLabels.findFirst({
      where: and(
        eq(cardLabels.cardId, cardId),
        eq(cardLabels.labelId, labelId)
      ),
    });
  },

  remove: async (cardId: string, labelId: string) => {
    await db
      .delete(cardLabels)
      .where(
        and(eq(cardLabels.cardId, cardId), eq(cardLabels.labelId, labelId))
      );
  },
};
