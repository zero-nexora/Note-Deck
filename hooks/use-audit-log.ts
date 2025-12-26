"use client";

import {
  logWorkspaceActionAction,
  readAuditLogsAction,
} from "@/app/actions/audit-log.action";
import {
  LogWorkspaceActionInput,
  ReadAuditLogsInput,
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

  const readLogs = async (input: ReadAuditLogsInput) => {
    try {
      const result = await readAuditLogsAction(input);
      if (result.success) {
        return result.data;
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error: any) {
      toast.error(error.message);
      return null;
    }
  };

  return {
    logAction,
    readLogs,
  };
}
