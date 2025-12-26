"use server";

import {
  CreateAttachmentInput,
  CreateAttachmentSchema,
  DeleteAttachmentInput,
  DeleteAttachmentSchema,
} from "@/domain/schemas/attachment.schema";
import { attachmentService } from "@/domain/services/attachment.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createAttachmentAction = async (input: CreateAttachmentInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateAttachmentSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const attachment = await attachmentService.create(user.id, parsed.data);
    return success("Attachment uploaded successfully", attachment);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteAttachmentAction = async (input: DeleteAttachmentInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteAttachmentSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await attachmentService.delete(user.id, parsed.data);
    return success("Attachment deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
