"use client";

import {
  addCardLabelAction,
  removeCardLabelAction,
} from "@/app/actions/card-label.action";
import { CreateCardLabelInput } from "@/domain/schemas/card-label.schema";
import { CardLabel } from "@/domain/types/card-label.type";
import { ActionResult } from "@/lib/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCardLabel() {
  const router = useRouter();

  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const [addState, setAddState] = useState<ActionResult<CardLabel>>({
    success: false,
    message: "",
  });

  const [removeState, setRemoveState] = useState<ActionResult<unknown>>({
    success: false,
    message: "",
  });

  const addCardLabel = async (boardId: string, input: CreateCardLabelInput) => {
    setAddLoading(true);
    try {
      const result = await addCardLabelAction(boardId, input);
      setAddState(result);
    } finally {
      setAddLoading(false);
    }
  };

  const removeCardLabel = async (
    boardId: string,
    cardId: string,
    labelId: string
  ) => {
    setRemoveLoading(true);
    try {
      const result = await removeCardLabelAction(boardId, cardId, labelId);
      setRemoveState(result);
    } finally {
      setRemoveLoading(false);
    }
  };

  useEffect(() => {
    if (!addState.message) return;

    addState.success
      ? toast.success(addState.message)
      : toast.error(addState.message);

    if (addState.success) router.refresh();
  }, [addState, router]);

  useEffect(() => {
    if (!removeState.message) return;

    removeState.success
      ? toast.success(removeState.message)
      : toast.error(removeState.message);

    if (removeState.success) router.refresh();
  }, [removeState, router]);

  return {
    addCardLabel,
    addCardLabelPending: addLoading,

    removeCardLabel,
    removeCardLabelPending: removeLoading,
  };
}
