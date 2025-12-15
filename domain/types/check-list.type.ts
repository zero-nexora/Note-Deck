import { checklists } from "@/db/schema";

export type Checklist = typeof checklists.$inferSelect;
export type NewChecklist = typeof checklists.$inferInsert;
export type UpdateChecklist = Partial<NewChecklist>;
