import { checklistItems } from "@/db/schema";

export type ChecklistItem = typeof checklistItems.$inferSelect;
export type NewChecklistItem = typeof checklistItems.$inferInsert;
export type UpdateChecklistItem = Partial<NewChecklistItem>;
