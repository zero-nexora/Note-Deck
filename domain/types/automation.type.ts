import { automations } from "@/db/schema";

export type Automation = typeof automations.$inferSelect;
export type NewAutomation = typeof automations.$inferInsert;
export type UpdateAutomation = Partial<NewAutomation>;