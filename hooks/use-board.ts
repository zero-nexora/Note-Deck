"use client";

import {
  createBoardAction,
  updateBoardAction,
  archiveBoardAction,
  restoreBoardAction,
  deleteBoardAction,
} from "@/domain/actions/board.action";
import {
  CreateBoardInput,
  UpdateBoardInput,
  ArchiveBoardInput,
  RestoreBoardInput,
  DeleteBoardInput,
} from "@/domain/schemas/board.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useBoard() {
  const router = useRouter();

  const createBoard = async (input: CreateBoardInput) => {
    const result = await createBoardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    router.push(`/boards/${result.data!.id}`);
  };

  const updateBoard = async (boardId: string, input: UpdateBoardInput) => {
    const result = await updateBoardAction(boardId, input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const archiveBoard = async (input: ArchiveBoardInput) => {
    const result = await archiveBoardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  const restoreBoard = async (input: RestoreBoardInput) => {
    const result = await restoreBoardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  const deleteBoard = async (input: DeleteBoardInput) => {
    const result = await deleteBoardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.push("/boards");
  };

  return {
    createBoard,
    updateBoard,
    archiveBoard,
    restoreBoard,
    deleteBoard,
  };
}
