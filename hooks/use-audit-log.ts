"use client";

import { logActionAction } from "@/domain/actions/audit-log.action";
import { LogWorkspaceActionInput } from "@/domain/schemas/audit-log.schema";
import { toast } from "sonner";

export function useAuditLog() {
  const logAction = async (input: LogWorkspaceActionInput) => {
    const result = await logActionAction(input);
    if (!result.success) return toast.error(result.message);
  };

  return {
    logAction,
  };
}
