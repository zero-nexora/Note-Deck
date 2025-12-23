"use client";

import {
  createBoardAction,
  updateBoardAction,
  deleteBoardAction,
} from "@/app/actions/board.action";
import {
  CreateBoardInput,
  UpdateBoardInput,
} from "@/domain/schemas/borad.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useBoard() {
  const router = useRouter();

  const createBoard = async (input: CreateBoardInput) => {
    try {
      const result = await createBoardAction(input);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        router.push(
          `/workspaces/${result.data!.workspaceId}/boards/${result.data!.id}`
        );
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateBoard = async (id: string, input: UpdateBoardInput) => {
    try {
      const result = await updateBoardAction(id, input);

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

  const deleteBoard = async (boardId: string) => {
    try {
      const result = await deleteBoardAction(boardId);

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
    createBoard,

    updateBoard,

    deleteBoard,
  };
}
