import { cards } from "@/db/schema";

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type UpdateCard = Partial<NewCard>;
