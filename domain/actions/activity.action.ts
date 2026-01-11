import {
  LogBoardActionInput,
  LogBoardActionSchema,
  LogListActionInput,
  LogListActionSchema,
  LogCardActionInput,
  LogCardActionSchema,
  ReadActivityInput,
  ReadActivitySchema,
} from "@/domain/schemas/activity.schema";
import { activityService } from "@/domain/services/activity.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const logBoardActionAction = async (input: LogBoardActionInput) => {
  try {
    const user = await requireAuth();
    const parsed = LogBoardActionSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const activity = await activityService.logBoard(user.id, parsed.data);
    return success("Activity logged successfully", activity);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const logListActionAction = async (input: LogListActionInput) => {
  try {
    const user = await requireAuth();
    const parsed = LogListActionSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const activity = await activityService.logList(user.id, parsed.data);
    return success("Activity logged successfully", activity);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const logCardActionAction = async (input: LogCardActionInput) => {
  try {
    const user = await requireAuth();
    const parsed = LogCardActionSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const activity = await activityService.logCard(user.id, parsed.data);
    return success("Activity logged successfully", activity);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const readActivityAction = async (input: ReadActivityInput) => {
  try {
    const user = await requireAuth();
    const parsed = ReadActivitySchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const activities = await activityService.read(user.id, parsed.data);
    return success("", activities);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
