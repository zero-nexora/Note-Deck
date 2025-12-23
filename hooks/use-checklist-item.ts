"use client";

import {
  createChecklistItemAction,
  toggleChecklistItemAction,
  updateChecklistItemAction,
  deleteChecklistItemAction,
} from "@/app/actions/checklist-item.action";
import {
  CreateChecklistItemInput,
  UpdateChecklistItemInput,
} from "@/domain/schemas/check-list-item.schema";
import { ChecklistItem } from "@/domain/types/check-list-item.type";
import { ActionResult } from "@/lib/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useChecklistItem() {
  const router = useRouter();

  const [createLoading, setCreateLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [createState, setCreateState] = useState<ActionResult<ChecklistItem>>({
    success: false,
    message: "",
  });

  const [toggleState, setToggleState] = useState<ActionResult<ChecklistItem>>({
    success: false,
    message: "",
  });

  const [updateState, setUpdateState] = useState<ActionResult<ChecklistItem>>({
    success: false,
    message: "",
  });

  const [deleteState, setDeleteState] = useState<ActionResult<unknown>>({
    success: false,
    message: "",
  });

  const createChecklistItem = async (
    boardId: string,
    input: CreateChecklistItemInput
  ) => {
    setCreateLoading(true);
    try {
      const result = await createChecklistItemAction(boardId, input);
      setCreateState(result);
    } finally {
      setCreateLoading(false);
    }
  };

  const toggleChecklistItem = async (
    boardId: string,
    itemId: string,
    isCompleted: boolean
  ) => {
    setToggleLoading(true);
    try {
      const result = await toggleChecklistItemAction(
        boardId,
        itemId,
        isCompleted
      );
      setToggleState(result);
    } finally {
      setToggleLoading(false);
    }
  };

  const updateChecklistItem = async (
    boardId: string,
    itemId: string,
    input: UpdateChecklistItemInput
  ) => {
    setUpdateLoading(true);
    try {
      const result = await updateChecklistItemAction(boardId, itemId, input);
      setUpdateState(result);
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteChecklistItem = async (boardId: string, itemId: string) => {
    setDeleteLoading(true);
    try {
      const result = await deleteChecklistItemAction(boardId, itemId);
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
    if (!toggleState.message) return;

    toggleState.success
      ? toast.success(toggleState.message)
      : toast.error(toggleState.message);

    if (toggleState.success) router.refresh();
  }, [toggleState, router]);

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
    createChecklistItem,
    createChecklistItemPending: createLoading,

    toggleChecklistItem,
    toggleChecklistItemPending: toggleLoading,

    updateChecklistItem,
    updateChecklistItemPending: updateLoading,

    deleteChecklistItem,
    deleteChecklistItemPending: deleteLoading,
  };
}
