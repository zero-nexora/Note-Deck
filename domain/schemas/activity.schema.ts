import z from "zod";

export const LogBoardActionSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  action: z.string().min(1, { message: "Action is required" }),
  entityType: z.string().min(1, { message: "Entity type is required" }),
  entityId: z.string().min(1, { message: "Entity ID is required" }),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const LogListActionSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  action: z.string().min(1, { message: "Action is required" }),
  entityType: z.string().min(1, { message: "Entity type is required" }),
  entityId: z.string().min(1, { message: "Entity ID is required" }),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const LogCardActionSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }),
  action: z.string().min(1, { message: "Action is required" }),
  entityType: z.string().min(1, { message: "Entity type is required" }),
  entityId: z.string().min(1, { message: "Entity ID is required" }),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const ReadActivitySchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }).optional(),
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }).optional(),
  limit: z.number().int().positive().optional(),
});

export type LogBoardActionInput = z.infer<typeof LogBoardActionSchema>;
export type LogListActionInput = z.infer<typeof LogListActionSchema>;
export type LogCardActionInput = z.infer<typeof LogCardActionSchema>;
export type ReadActivityInput = z.infer<typeof ReadActivitySchema>;
