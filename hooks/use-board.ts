"use client";
import {
  archiveBoardAction,
  createBoardAction,
  deleteBoardAction,
  restoreBoardAction,
  updateBoardAction,
} from "@/app/actions/board.action";
import {
  ArchiveBoardInput,
  CreateBoardInput,
  DeleteBoardInput,
  RestoreBoardInput,
  UpdateBoardInput,
} from "@/domain/schemas/board.schema";
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
        router.push(`/boards/${result.data!.id}`);
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

  const archiveBoard = async (input: ArchiveBoardInput) => {
    try {
      const result = await archiveBoardAction(input);
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

  const restoreBoard = async (input: RestoreBoardInput) => {
    try {
      const result = await restoreBoardAction(input);
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

  const deleteBoard = async (input: DeleteBoardInput) => {
    try {
      const result = await deleteBoardAction(input);
      if (result.success) {
        toast.success(result.message);
        router.push("/boards");
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
    archiveBoard,
    restoreBoard,
    deleteBoard,
  };
}
