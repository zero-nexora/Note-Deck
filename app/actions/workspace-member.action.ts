import {
  CreateWorkspaceMemberInput,
  CreateWorkspaceMemberSchema,
} from "@/domain/schemas/workspace-member.schema";
import { workspaceMemberService } from "@/domain/services/workspace-member.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const workspaceMemberAction = {
  invite: async (formData: FormData) => {
    try {
      const user = await requireAuth();

      const parsed = CreateWorkspaceMemberSchema.safeParse({
        workspaceId: formData.get("workspaceId")?.toString(),
        userId: formData.get("userId")?.toString(),
        role: formData.get("role")?.toString(),
        isGuest: formData.get("isGuest")
          ? formData.get("isGuest") === "true"
          : undefined,
      });

      if (!parsed.success) {
        return error("Invalid input", parsed.error.flatten());
      }

      const data: CreateWorkspaceMemberInput = parsed.data;

      const member = await workspaceMemberService.invite(user.email, data);

      return success("Member invited successfully", member);
    } catch (err: any) {
      return error(err.message, err);
    }
  },
};
