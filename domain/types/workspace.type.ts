import { workspaces } from "@/db/schema";

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type UpdateWorkspace = Partial<NewWorkspace>;
