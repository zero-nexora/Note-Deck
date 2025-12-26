import z from "zod";
import { JsonValue } from "./common.schem";

export const LogBoardActionSchema = z.object({
  boardId: z.string().min(1),
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  metadata: JsonValue.optional().default({}),
});

export const LogListActionSchema = z.object({
  boardId: z.string().min(1),
  listId: z.string().min(1),
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  metadata: JsonValue.optional().default({}),
});

export const LogCardActionSchema = z.object({
  boardId: z.string().min(1),
  cardId: z.string().min(1),
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  metadata: JsonValue.optional().default({}),
});

export const ReadActivitySchema = z.object({
  boardId: z.string().optional(),
  cardId: z.string().optional(),
  limit: z.number().int().positive().optional().default(100),
});

export type LogBoardActionInput = z.infer<typeof LogBoardActionSchema>;
export type LogListActionInput = z.infer<typeof LogListActionSchema>;
export type LogCardActionInput = z.infer<typeof LogCardActionSchema>;
export type ReadActivityInput = z.infer<typeof ReadActivitySchema>;
