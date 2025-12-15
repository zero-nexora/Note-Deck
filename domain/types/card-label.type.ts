import { cardLabels } from "@/db/schema";

export type CardLabel = typeof cardLabels.$inferSelect;
export type NewCardLabel = typeof cardLabels.$inferInsert;
