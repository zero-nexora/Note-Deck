import { cards } from "@/db/schema";
import { cardService } from "../services/card.service";

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type UpdateCard = Partial<NewCard>;

export type CardWithCardLabelsChecklistsCommentsAttachmentsActivitiesMembers =
  Awaited<ReturnType<typeof cardService.findById>>;
export type LimitCardsPerBoard = Awaited<
  ReturnType<typeof cardService.findLimitByBoardId>
>;
