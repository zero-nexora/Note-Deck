"use server";

import {
  CreateWorkspaceMemberInput,
  CreateWorkspaceMemberSchema,
} from "@/domain/schemas/workspace-member.schema";
import { workspaceMemberService } from "@/domain/services/workspace-member.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const inviteWorkspaceMember = async (
  input: CreateWorkspaceMemberInput
) => {
  try {
    const user = await requireAuth();

    const parsed = CreateWorkspaceMemberSchema.safeParse({
      workspaceId: input.workspaceId,
      userId: input.userId,
      role: input.role,
      isGuest: input.isGuest,
    });

    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";

      return error(message);
    }

    const validatedData: CreateWorkspaceMemberInput = parsed.data;

    const member = await workspaceMemberService.invite(
      user.id,
      user.email!,
      validatedData
    );

    return success("Member invited successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
