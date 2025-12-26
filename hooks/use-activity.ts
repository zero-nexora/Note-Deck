import {
  logBoardActionAction,
  logCardActionAction,
  logListActionAction,
  readActivityAction,
} from "@/app/actions/activity.action";
import {
  LogBoardActionInput,
  LogCardActionInput,
  LogListActionInput,
  ReadActivityInput,
} from "@/domain/schemas/activity.schema";
import { toast } from "sonner";

export function useActivity() {
  const logBoardAction = async (input: LogBoardActionInput) => {
    try {
      const result = await logBoardActionAction(input);
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const logListAction = async (input: LogListActionInput) => {
    try {
      const result = await logListActionAction(input);
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const logCardAction = async (input: LogCardActionInput) => {
    try {
      const result = await logCardActionAction(input);
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const readActivity = async (input: ReadActivityInput) => {
    try {
      const result = await readActivityAction(input);
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
    logBoardAction,
    logListAction,
    logCardAction,
    readActivity,
  };
}
