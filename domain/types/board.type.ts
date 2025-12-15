import { boards } from "@/db/schema";

export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;
export type UpdateBoard = Partial<NewBoard>;