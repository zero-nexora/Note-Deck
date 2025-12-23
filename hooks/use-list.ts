"use client";

import {
  createListAction,
  updateListAction,
  moveListAction,
  archiveListAction,
  deleteListAction,
} from "@/app/actions/list.action";
import { CreateListInput, UpdateListInput } from "@/domain/schemas/list.schema";
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

  const updateList = async (listId: string, input: UpdateListInput) => {
    try {
      const result = await updateListAction(listId, input);
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

  const moveList = async (input: { id: string; position: number }) => {
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

  const archiveList = async (listId: string) => {
    try {
      const result = await archiveListAction(listId);

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

  const deleteList = async (listId: string) => {
    try {
      const result = await deleteListAction(listId);

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

    moveList,

    archiveList,

    deleteList,
  };
}
