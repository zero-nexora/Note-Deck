"use client";

import {
  addCardMemberAction,
  removeCardMemberAction,
} from "@/app/actions/card-member.action";
import { CreateCardMemberInput } from "@/domain/schemas/card-member.schema";
import { CardMember } from "@/domain/types/card-member.type";
import { ActionResult } from "@/lib/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCardMember() {
  const router = useRouter();

  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const [addState, setAddState] = useState<ActionResult<CardMember>>({
    success: false,
    message: "",
  });

  const [removeState, setRemoveState] = useState<ActionResult<unknown>>({
    success: false,
    message: "",
  });

  const addCardMember = async (
    boardId: string,
    input: CreateCardMemberInput
  ) => {
    setAddLoading(true);
    try {
      const result = await addCardMemberAction(boardId, input);
      setAddState(result);
    } finally {
      setAddLoading(false);
    }
  };

  const removeCardMember = async (
    boardId: string,
    cardId: string,
    memberUserId: string
  ) => {
    setRemoveLoading(true);
    try {
      const result = await removeCardMemberAction(
        boardId,
        cardId,
        memberUserId
      );
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
    addCardMember,
    addCardMemberPending: addLoading,

    removeCardMember,
    removeCardMemberPending: removeLoading,
  };
}
