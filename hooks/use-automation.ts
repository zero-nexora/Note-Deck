"use client";

import {
  createAutomationAction,
  deleteAutomationAction,
  disableAutomationAction,
  enableAutomationAction,
  updateAutomationAction,
} from "@/app/actions/automation.action";
import {
  CreateAutomationInput,
  DeleteAutomationInput,
  DisableAutomationInput,
  EnableAutomationInput,
  UpdateAutomationInput,
} from "@/domain/schemas/automation.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAutomation() {
  const router = useRouter();

  const createAutomation = async (input: CreateAutomationInput) => {
    try {
      const result = await createAutomationAction(input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data;
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error: any) {
      toast.error(error.message);
      return null;
    }
  };

  const updateAutomation = async (id: string, input: UpdateAutomationInput) => {
    try {
      const result = await updateAutomationAction(id, input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data;
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error: any) {
      toast.error(error.message);
      return null;
    }
  };

  const enableAutomation = async (input: EnableAutomationInput) => {
    try {
      const result = await enableAutomationAction(input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data;
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error: any) {
      toast.error(error.message);
      return null;
    }
  };

  const disableAutomation = async (input: DisableAutomationInput) => {
    try {
      const result = await disableAutomationAction(input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data;
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error: any) {
      toast.error(error.message);
      return null;
    }
  };

  const deleteAutomation = async (input: DeleteAutomationInput) => {
    try {
      const result = await deleteAutomationAction(input);
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
    createAutomation,
    updateAutomation,
    enableAutomation,
    disableAutomation,
    deleteAutomation,
  };
}
