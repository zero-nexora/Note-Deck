"use client";

import {
  addCommentReactionAction,
  removeCommentReactionAction,
} from "@/domain/actions/comment-reaction.action";
import {
  AddCommentReactionInput,
  RemoveCommentReactionInput,
} from "@/domain/schemas/comment-reaction.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCommentReaction() {
  const router = useRouter();

  const addReaction = async (input: AddCommentReactionInput) => {
    const result = await addCommentReactionAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const removeReaction = async (input: RemoveCommentReactionInput) => {
    const result = await removeCommentReactionAction(input);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    addReaction,
    removeReaction,
  };
}
