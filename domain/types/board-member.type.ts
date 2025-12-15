import { boardMembers } from "@/db/schema";

export type BoardMember = typeof boardMembers.$inferSelect;
export type NewBoardMember = typeof boardMembers.$inferInsert;
export type UpdateBoardMember = Partial<NewBoardMember>;
