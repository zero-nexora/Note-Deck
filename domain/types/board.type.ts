import { boards } from "@/db/schema";
import { boardService } from "../services/board.service";

export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;
export type UpdateBoard = Partial<NewBoard>;

export type BoardWithMember = Awaited<
  ReturnType<typeof boardService.findByWorkspaceId>
>[number];

export type BoardWithListLabelsAndMembers = Awaited<
  ReturnType<typeof boardService.findById>
>;
