import { labels } from "@/db/schema";
import { labelService } from "../services/label.service";

export type Label = typeof labels.$inferSelect;
export type NewLabel = typeof labels.$inferInsert;
export type UpdateLabel = Partial<NewLabel>;

export type LabelDetail = Awaited<ReturnType<typeof labelService.findLabelByBoardId>>[number]