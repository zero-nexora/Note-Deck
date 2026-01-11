"use client";

import {
  addCardMemberAction,
  removeCardMemberAction,
} from "@/domain/actions/card-member.action";
import {
  AddCardMemberInput,
  RemoveCardMemberInput,
} from "@/domain/schemas/card-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCardMember() {
  const router = useRouter();

  const addCardMember = async (input: AddCardMemberInput) => {
    const result = await addCardMemberAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }

    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const removeCardMember = async (input: RemoveCardMemberInput) => {
    const result = await removeCardMemberAction(input);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  };

  return {
    addCardMember,
    removeCardMember,
  };
}
