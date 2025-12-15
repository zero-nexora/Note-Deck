import { db } from "@/db";
import { cardLabels } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const cardLabelRepository = {
  add: async (cardId: string, labelId: string) => {
    const [label] = await db
      .insert(cardLabels)
      .values({ cardId, labelId })
      .returning();

    return label;
  },

  remove: async (cardId: string, labelId: string) => {
    await db
      .delete(cardLabels)
      .where(
        and(eq(cardLabels.cardId, cardId), eq(cardLabels.labelId, labelId))
      );
  },
};
