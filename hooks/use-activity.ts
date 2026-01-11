"use client";

import {
  logBoardActionAction,
  logListActionAction,
  logCardActionAction,
  readActivityAction,
} from "@/domain/actions/activity.action";
import {
  LogBoardActionInput,
  LogCardActionInput,
  LogListActionInput,
  ReadActivityInput,
} from "@/domain/schemas/activity.schema";
import { toast } from "sonner";

export function useActivity() {
  const logBoardAction = async (input: LogBoardActionInput) => {
    const result = await logBoardActionAction(input);
    if (!result.success) return toast.error(result.message);
  };

  const logListAction = async (input: LogListActionInput) => {
    const result = await logListActionAction(input);
    if (!result.success) return toast.error(result.message);
  };

  const logCardAction = async (input: LogCardActionInput) => {
    const result = await logCardActionAction(input);
    if (!result.success) return toast.error(result.message);
  };

  const readActivity = async (input: ReadActivityInput) => {
    const result = await readActivityAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    return result.data;
  };

  return {
    logBoardAction,
    logListAction,
    logCardAction,
    readActivity,
  };
}
