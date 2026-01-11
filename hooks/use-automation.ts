"use client";

import {
  createAutomationAction,
  updateAutomationAction,
  enableAutomationAction,
  disableAutomationAction,
  deleteAutomationAction,
} from "@/domain/actions/automation.action";
import {
  CreateAutomationInput,
  UpdateAutomationInput,
  EnableAutomationInput,
  DisableAutomationInput,
  DeleteAutomationInput,
} from "@/domain/schemas/automation.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAutomation() {
  const router = useRouter();

  const createAutomation = async (input: CreateAutomationInput) => {
    const result = await createAutomationAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const updateAutomation = async (id: string, input: UpdateAutomationInput) => {
    const result = await updateAutomationAction(id, input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const enableAutomation = async (input: EnableAutomationInput) => {
    const result = await enableAutomationAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const disableAutomation = async (input: DisableAutomationInput) => {
    const result = await disableAutomationAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const deleteAutomation = async (input: DeleteAutomationInput) => {
    const result = await deleteAutomationAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  return {
    createAutomation,
    updateAutomation,
    enableAutomation,
    disableAutomation,
    deleteAutomation,
  };
}
