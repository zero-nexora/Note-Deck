"use client";

import {
  logWorkspaceActionAction,
} from "@/app/actions/audit-log.action";
import {
  LogWorkspaceActionInput,
} from "@/domain/schemas/audit-log.schema";
import { toast } from "sonner";

export function useAuditLog() {
  const logAction = async (input: LogWorkspaceActionInput) => {
    try {
      const result = await logWorkspaceActionAction(input);
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    logAction,
  };
}
