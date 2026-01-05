import { boardMembers } from "@/db/schema";
import { boardMemberService } from "../services/board-member.service";

export type BoardMember = typeof boardMembers.$inferSelect;
export type NewBoardMember = typeof boardMembers.$inferInsert;
export type UpdateBoardMember = Partial<NewBoardMember>;

export type BoardWithUser = Awaited<ReturnType<typeof boardMemberService.list>>[number];