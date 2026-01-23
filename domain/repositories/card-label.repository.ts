import { db } from "@/db";
import { cardLabels } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NewCardLabel } from "../types/card-label.type";

export const cardLabelRepository = {
  addWithLabel: async (data: NewCardLabel) => {
    const [insert] = await db
      .insert(cardLabels)
      .values(data)
      .returning({ cardId: cardLabels.cardId, labelId: cardLabels.labelId });

    return db.query.cardLabels.findFirst({
      where: and(
        eq(cardLabels.cardId, insert.cardId),
        eq(cardLabels.labelId, insert.labelId),
      ),
      with: {
        label: true,
      },
    });
  },

  add: async (data: NewCardLabel) => {
    const [label] = await db.insert(cardLabels).values(data).returning();

    return label;
  },

  // findByCardId: async (cardId: string) => {
  //   return db.query.cardLabels.findMany({
  //     where: eq(cardLabels.cardId, cardId),
  //     with: {
  //       label: true,
  //     },
  //   });
  // },

  // findByCardIdWithLabel: async (cardId: string) => {
  //   return db.query.cardLabels.findMany({
  //     where: eq(cardLabels.cardId, cardId),
  //     with: {
  //       label: true,
  //     },
  //   });
  // },

  findByCardIdAndLabelId: async (cardId: string, labelId: string) => {
    return db.query.cardLabels.findFirst({
      where: and(
        eq(cardLabels.cardId, cardId),
        eq(cardLabels.labelId, labelId),
      ),
    });
  },

  remove: async (cardId: string, labelId: string) => {
    await db
      .delete(cardLabels)
      .where(
        and(eq(cardLabels.cardId, cardId), eq(cardLabels.labelId, labelId)),
      );
  },
};
