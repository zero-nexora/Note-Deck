"use server";

import { boardMemberRepository } from "@/domain/repositories/board-member.repository";
import {
  CreateBoardMemberInput,
  CreateBoardMemberSchema,
} from "@/domain/schemas/borad-member.schema";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const inviteBoardMember = async (input: CreateBoardMemberInput) => {
  try {
    const user = await requireAuth();

    const parsed = CreateBoardMemberSchema.safeParse({
      boardId: input.boardId,
      userId: input.userId,
      role: input.role,
    });

    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";

      return error(message);
    }

    const validatedData: CreateBoardMemberInput = parsed.data;

    const member = await boardMemberRepository.addMember(validatedData);

    return success("Member invited successfully", member);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
