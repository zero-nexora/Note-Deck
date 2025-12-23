"use client";

import {
  createChecklistAction,
  updateChecklistAction,
  moveChecklistAction,
  deleteChecklistAction,
} from "@/app/actions/checklist.action";
import {
  CreateChecklistInput,
  UpdateChecklistInput,
} from "@/domain/schemas/check-list.schema";
import { Checklist } from "@/domain/types/check-list.type";
import { ActionResult } from "@/lib/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useChecklist() {
  const router = useRouter();

  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [createState, setCreateState] = useState<ActionResult<Checklist>>({
    success: false,
    message: "",
  });

  const [updateState, setUpdateState] = useState<ActionResult<Checklist>>({
    success: false,
    message: "",
  });

  const [moveState, setMoveState] = useState<ActionResult<Checklist>>({
    success: false,
    message: "",
  });

  const [deleteState, setDeleteState] = useState<ActionResult<unknown>>({
    success: false,
    message: "",
  });

  const createChecklist = async (
    boardId: string,
    input: CreateChecklistInput
  ) => {
    setCreateLoading(true);
    try {
      const result = await createChecklistAction(boardId, input);
      setCreateState(result);
    } finally {
      setCreateLoading(false);
    }
  };

  const updateChecklist = async (
    boardId: string,
    id: string,
    input: UpdateChecklistInput
  ) => {
    setUpdateLoading(true);
    try {
      const result = await updateChecklistAction(boardId, id, input);
      setUpdateState(result);
    } finally {
      setUpdateLoading(false);
    }
  };

  const moveChecklist = async (input: {
    boardId: string;
    checklistId: string;
    position: number;
  }) => {
    setMoveLoading(true);
    try {
      const result = await moveChecklistAction(input);
      setMoveState(result);
    } finally {
      setMoveLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteChecklist = async (boardId: string, id: string) => {
    setDeleteLoading(true);
    try {
      const result = await deleteChecklistAction(boardId, id);
      setDeleteState(result);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= EFFECTS ================= */
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
    if (!moveState.message) return;

    moveState.success
      ? toast.success(moveState.message)
      : toast.error(moveState.message);

    if (moveState.success) router.refresh();
  }, [moveState, router]);

  useEffect(() => {
    if (!deleteState.message) return;

    deleteState.success
      ? toast.success(deleteState.message)
      : toast.error(deleteState.message);

    if (deleteState.success) router.refresh();
  }, [deleteState, router]);

  return {
    createChecklist,
    createChecklistPending: createLoading,

    updateChecklist,
    updateChecklistPending: updateLoading,

    moveChecklist,
    moveChecklistPending: moveLoading,

    deleteChecklist,
    deleteChecklistPending: deleteLoading,
  };
}
