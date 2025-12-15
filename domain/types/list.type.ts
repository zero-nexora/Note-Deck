import { lists } from "@/db/schema";

export type List = typeof lists.$inferSelect;
export type NewList = typeof lists.$inferInsert;
export type UpdateList = Partial<NewList>;
