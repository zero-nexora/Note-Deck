"use client";

import {
  markAsReadAction,
  markAllAsReadAction,
  deleteNotificationAction,
} from "@/domain/actions/notification.action";
import {
  MarkAsReadInput,
  DeleteNotificationInput,
} from "@/domain/schemas/notification.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useNotification() {
  const router = useRouter();

  const markAsRead = async (input: MarkAsReadInput) => {
    const result = await markAsReadAction(input);
    if (!result.success) return toast.error(result.message);
    router.refresh();
  };

  const markAllAsRead = async () => {
    const result = await markAllAsReadAction();
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  const deleteNotification = async (input: DeleteNotificationInput) => {
    const result = await deleteNotificationAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
