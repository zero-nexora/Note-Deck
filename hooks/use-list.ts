"use client";

import {
  createListAction,
  updateListAction,
  reorderListsAction,
  archiveListAction,
  restoreListAction,
  deleteListAction,
  duplicateListAction,
} from "@/domain/actions/list.action";
import {
  CreateListInput,
  UpdateListInput,
  ReorderListsInput,
  ArchiveListInput,
  RestoreListInput,
  DeleteListInput,
  DuplicateListInput,
} from "@/domain/schemas/list.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useList() {
  const router = useRouter();

  const createList = async (input: CreateListInput) => {
    const result = await createListAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const updateList = async (id: string, input: UpdateListInput) => {
    const result = await updateListAction(id, input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const reorderLists = async (input: ReorderListsInput) => {
    const result = await reorderListsAction(input);
    if (!result.success) {
      toast.error(result.message);
      return false;
    }
    toast.success(result.message);
    router.refresh();
    return true;
  };

  const archiveList = async (input: ArchiveListInput) => {
    const result = await archiveListAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const restoreList = async (input: RestoreListInput) => {
    const result = await restoreListAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const deleteList = async (input: DeleteListInput) => {
    const result = await deleteListAction(input);
    if (!result.success) {
      toast.error(result.message);
      return false;
    }
    toast.success(result.message);
    router.refresh();
    return true;
  };

  const duplicateList = async (input: DuplicateListInput) => {
    const result = await duplicateListAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  return {
    createList,
    updateList,
    reorderLists,
    archiveList,
    restoreList,
    deleteList,
    duplicateList,
  };
}
