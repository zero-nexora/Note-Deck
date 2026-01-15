"use client";

import {
  createAttachmentAction,
  deleteAttachmentAction,
} from "@/domain/actions/attachment.action";
import {
  CreateAttachmentInput,
  DeleteAttachmentInput,
} from "@/domain/schemas/attachment.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAttachment() {
  const router = useRouter();

  const uploadAttachment = async (input: CreateAttachmentInput) => {
    const result = await createAttachmentAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const deleteAttachment = async (input: DeleteAttachmentInput) => {
    const result = await deleteAttachmentAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    uploadAttachment,
    deleteAttachment,
  };
}
