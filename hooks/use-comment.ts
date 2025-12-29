"use client";

import {
  createCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/app/actions/comment.action";
import {
  CreateCommentInput,
  DeleteCommentInput,
  UpdateCommentInput,
} from "@/domain/schemas/comment.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useComment() {
  const router = useRouter();

  const createComment = async (input: CreateCommentInput) => {
    try {
      const result = await createCommentAction(input);
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

  const updateComment = async (id: string, input: UpdateCommentInput) => {
    try {
      const result = await updateCommentAction(id, input);
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

  const deleteComment = async (input: DeleteCommentInput) => {
    try {
      const result = await deleteCommentAction(input);
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
    createComment,

    updateComment,

    deleteComment,
  };
}
