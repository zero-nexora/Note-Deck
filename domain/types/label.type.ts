import { labels } from "@/db/schema";

export type Label = typeof labels.$inferSelect;
export type NewLabel = typeof labels.$inferInsert;
export type UpdateLabel = Partial<NewLabel>;
