"use client";

import {
  archiveListAction,
  createListAction,
  deleteListAction,
  moveListAction,
  reorderListsAction,
  restoreListAction,
  updateListAction,
} from "@/app/actions/list.action";
import {
  ArchiveListInput,
  CreateListInput,
  DeleteListInput,
  MoveListInput,
  ReorderListsInput,
  RestoreListInput,
  UpdateListInput,
} from "@/domain/schemas/list.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useList() {
  const router = useRouter();

  const createList = async (input: CreateListInput) => {
    try {
      const result = await createListAction(input);
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

  const updateList = async (id: string, input: UpdateListInput) => {
    try {
      const result = await updateListAction(id, input);
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

  const reorderLists = async (input: ReorderListsInput) => {
    try {
      const result = await reorderListsAction(input);
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

  const moveList = async (input: MoveListInput) => {
    try {
      const result = await moveListAction(input);
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

  const archiveList = async (input: ArchiveListInput) => {
    try {
      const result = await archiveListAction(input);
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

  const restoreList = async (input: RestoreListInput) => {
    try {
      const result = await restoreListAction(input);
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

  const deleteList = async (input: DeleteListInput) => {
    try {
      const result = await deleteListAction(input);
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
    createList,
    updateList,
    reorderLists,
    moveList,
    archiveList,
    restoreList,
    deleteList,
  };
}
