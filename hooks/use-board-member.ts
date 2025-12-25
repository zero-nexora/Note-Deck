"use client";

import { inviteBoardMember } from "@/app/actions/board-member.action";
import { CreateBoardMemberInput } from "@/domain/schemas/borad-member.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useBoardMember() {
  const router = useRouter();

  const inviteMember = async (input: CreateBoardMemberInput) => {
    try {
      const result = await inviteBoardMember(input);

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
