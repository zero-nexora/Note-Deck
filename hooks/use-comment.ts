"use client";

import {
  createCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/app/actions/comment.action";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "@/domain/schemas/comment.schema";
import { Comment } from "@/domain/types/comment.type";
import { ActionResult } from "@/lib/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useComment() {
  const router = useRouter();

  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [createState, setCreateState] = useState<ActionResult<Comment>>({
    success: false,
    message: "",
  });

  const [updateState, setUpdateState] = useState<ActionResult<Comment>>({
    success: false,
    message: "",
  });

  const [deleteState, setDeleteState] = useState<ActionResult<unknown>>({
    success: false,
    message: "",
  });

  const createComment = async (boardId: string, input: CreateCommentInput) => {
    setCreateLoading(true);
    try {
      const result = await createCommentAction(boardId, input);
      setCreateState(result);
    } finally {
      setCreateLoading(false);
    }
  };

  const updateComment = async (
    boardId: string,
    id: string,
    input: UpdateCommentInput
  ) => {
    setUpdateLoading(true);
    try {
      const result = await updateCommentAction(boardId, id, input);
      setUpdateState(result);
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteComment = async (boardId: string, commentId: string) => {
    setDeleteLoading(true);
    try {
      const result = await deleteCommentAction(boardId, commentId);
      setDeleteState(result);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (!createState.message) return;

    createState.success
      ? toast.success(createState.message)
      : toast.error(createState.message);

    if (createState.success) router.refresh();
  }, [createState, router]);

  useEffect(() => {
    if (!updateState.message) return;

    updateState.success
      ? toast.success(updateState.message)
      : toast.error(updateState.message);

    if (updateState.success) router.refresh();
  }, [updateState, router]);

  useEffect(() => {
    if (!deleteState.message) return;

    deleteState.success
      ? toast.success(deleteState.message)
      : toast.error(deleteState.message);

    if (deleteState.success) router.refresh();
  }, [deleteState, router]);

  return {
    createComment,
    createCommentPending: createLoading,

    updateComment,
    updateCommentPending: updateLoading,

    deleteComment,
    deleteCommentPending: deleteLoading,
  };
}
