import { activities } from "@/db/schema";

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;