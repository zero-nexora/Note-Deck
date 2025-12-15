import { cardMembers } from "@/db/schema";

export type CardMember = typeof cardMembers.$inferSelect;
export type NewCardMember = typeof cardMembers.$inferInsert;
