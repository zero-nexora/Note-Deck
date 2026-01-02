"use client";
import {
  deleteNotificationAction,
  listNotificationsAction,
  markAllAsReadAction,
  markAsReadAction,
} from "@/app/actions/notification.action";
import {
  DeleteNotificationInput,
  MarkAsReadInput,
} from "@/domain/schemas/notification.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useNotification() {
  const router = useRouter();

  const markAsRead = async (input: MarkAsReadInput) => {
    try {
      const result = await markAsReadAction(input);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const result = await markAllAsReadAction();
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

  const deleteNotification = async (input: DeleteNotificationInput) => {
    try {
      const result = await deleteNotificationAction(input);
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
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
