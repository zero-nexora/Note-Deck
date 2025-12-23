"use client";

import { inviteWorkspaceMember } from "@/app/actions/workspace-member.action";
import { CreateWorkspaceMemberInput } from "@/domain/schemas/workspace-member.schema";
import { WorkspaceMember } from "@/domain/types/workspace-member.type";
import { ActionResult } from "@/lib/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useWorkspaceMember() {
  const router = useRouter();

  const [inviteLoading, setInviteLoading] = useState(false);

  const [inviteState, setInviteState] = useState<ActionResult<WorkspaceMember>>(
    {
      success: false,
      message: "",
    }
  );

  const inviteMember = async (input: CreateWorkspaceMemberInput) => {
    setInviteLoading(true);
    try {
      const result = await inviteWorkspaceMember(input);
      setInviteState(result);
    } finally {
      setInviteLoading(false);
    }
  };

  useEffect(() => {
    if (!inviteState.message) return;

    inviteState.success
      ? toast.success(inviteState.message)
      : toast.error(inviteState.message);

    if (inviteState.success) router.refresh();
  }, [inviteState, router]);

  return {
    inviteMember,
    inviteMemberPending: inviteLoading,
  };
}
