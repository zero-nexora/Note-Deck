import { comments } from "@/db/schema";

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type UpdateComment = Partial<NewComment>;