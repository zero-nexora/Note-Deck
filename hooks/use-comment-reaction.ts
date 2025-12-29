"use client";
import {
  addCommentReactionAction,
  removeCommentReactionAction,
} from "@/app/actions/comment-reaction.action";
import {
  AddCommentReactionInput,
  RemoveCommentReactionInput,
} from "@/domain/schemas/comment-reaction.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCommentReaction() {
  const router = useRouter();

  const addReaction = async (input: AddCommentReactionInput) => {
    try {
      const result = await addCommentReactionAction(input);
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

  const removeReaction = async (input: RemoveCommentReactionInput) => {
    try {
      const result = await removeCommentReactionAction(input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    addReaction,
    removeReaction,
  };
}
