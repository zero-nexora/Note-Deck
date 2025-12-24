"use client";

import { inviteWorkspaceMember } from "@/app/actions/workspace-member.action";
import { CreateWorkspaceMemberInput } from "@/domain/schemas/workspace-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useWorkspaceMember() {
  const router = useRouter();

  const inviteMember = async (input: CreateWorkspaceMemberInput) => {
    try {
      const result = await inviteWorkspaceMember(input);

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
    inviteMember,
  };
}
