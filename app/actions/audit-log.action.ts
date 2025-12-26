"use server";

import {
  LogWorkspaceActionInput,
  LogWorkspaceActionSchema,
  ReadAuditLogsInput,
  ReadAuditLogsSchema,
} from "@/domain/schemas/audit-log.schema";
import { auditLogService } from "@/domain/services/audit-log.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const logWorkspaceActionAction = async (
  input: LogWorkspaceActionInput
) => {
  try {
    const user = await requireAuth();
    const parsed = LogWorkspaceActionSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const log = await auditLogService.log(user.id, parsed.data);
    return success("Action logged successfully", log);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const readAuditLogsAction = async (input: ReadAuditLogsInput) => {
  try {
    const user = await requireAuth();
    const parsed = ReadAuditLogsSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const logs = await auditLogService.read(user.id, parsed.data);
    return success("", logs);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
