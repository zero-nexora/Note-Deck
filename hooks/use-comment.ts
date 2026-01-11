"use client";

import {
  createCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/domain/actions/comment.action";
import {
  CreateCommentInput,
  UpdateCommentInput,
  DeleteCommentInput,
} from "@/domain/schemas/comment.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useComment() {
  const router = useRouter();

  const createComment = async (input: CreateCommentInput) => {
    const result = await createCommentAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const updateComment = async (id: string, input: UpdateCommentInput) => {
    const result = await updateCommentAction(id, input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const deleteComment = async (input: DeleteCommentInput) => {
    const result = await deleteCommentAction(input);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    createComment,
    updateComment,
    deleteComment,
  };
}
