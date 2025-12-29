"use client";
import {
  addCardMemberAction,
  removeCardMemberAction,
} from "@/app/actions/card-member.action";
import {
  AddCardMemberInput,
  RemoveCardMemberInput,
} from "@/domain/schemas/card-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCardMember() {
  const router = useRouter();

  const addMember = async (input: AddCardMemberInput) => {
    try {
      const result = await addCardMemberAction(input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const removeMember = async (input: RemoveCardMemberInput) => {
    try {
      const result = await removeCardMemberAction(input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    addMember,
    removeMember,
  };
}
