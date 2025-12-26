"use client";

import {
  createAttachmentAction,
  deleteAttachmentAction,
} from "@/app/actions/attachment.action";
import {
  CreateAttachmentInput,
  DeleteAttachmentInput,
} from "@/domain/schemas/attachment.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAttachment() {
  const router = useRouter();

  const uploadAttachment = async (input: CreateAttachmentInput) => {
    try {
      const result = await createAttachmentAction(input);
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

  const deleteAttachment = async (input: DeleteAttachmentInput) => {
    try {
      const result = await deleteAttachmentAction(input);
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
    uploadAttachment,
    deleteAttachment,
  };
}
