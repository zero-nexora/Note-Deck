import {
  checkBoardPermission,
  // checkUserGroupPermission,
} from "@/lib/check-permissions";
import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import { checklistRepository } from "../repositories/checklist.repository";
import {
  CreateChecklistInput,
  DeleteChecklistInput,
  ReorderChecklistInput,
  UpdateChecklistInput,
} from "../schemas/checklist.schema";
import {
  ACTIVITY_ACTION,
  ENTITY_TYPE,
  PERMISSIONS,
  ROLE,
} from "@/lib/constants";

export const checklistService = {
  create: async (userId: string, data: CreateChecklistInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRolePermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );

    // const hasCardChecklistPermission = await checkUserGroupPermission(
    //   userId,
    //   card.board.workspaceId,
    //   PERMISSIONS.CARD_CHECKLIST
    // );

    // if (!hasWorkspaceRolePermission || !hasCardChecklistPermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRolePermission) {
      throw new Error("Permission denied");
    }

    const trimmedTitle = data.title.trim();
    if (!trimmedTitle) {
      throw new Error("Checklist title cannot be empty");
    }

    const maxPosition = await checklistRepository.getMaxPosition(data.cardId);

    const checklist = await checklistRepository.create({
      ...data,
      title: trimmedTitle,
      position: maxPosition + 1,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CHECKLIST_CREATED,
      entityType: ENTITY_TYPE.CHECKLIST,
      entityId: checklist.id,
      metadata: { title: checklist.title },
    });

    return checklist;
  },

  update: async (
    userId: string,
    checklistId: string,
    data: UpdateChecklistInput
  ) => {
    const checklist = await checklistRepository.findById(checklistId);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRolePermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );

    // const hasCardChecklistPermission = await checkUserGroupPermission(
    //   userId,
    //   card.board.workspaceId,
    //   PERMISSIONS.CARD_CHECKLIST
    // );

    // if (!hasWorkspaceRolePermission || !hasCardChecklistPermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRolePermission) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.title !== undefined) {
      const trimmedTitle = data.title.trim();
      if (!trimmedTitle) {
        throw new Error("Checklist title cannot be empty");
      }
      updateData.title = trimmedTitle;

      if (checklist.title === trimmedTitle) {
        return checklist;
      }
    }

    const updatedChecklist = await checklistRepository.update(
      checklistId,
      updateData
    );

    const metadata: Record<string, any> = {};
    if (data.title !== undefined) {
      metadata.oldTitle = checklist.title;
      metadata.newTitle = updateData.title;
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CHECKLIST_UPDATED,
      entityType: ENTITY_TYPE.CHECKLIST,
      entityId: checklistId,
      metadata,
    });

    return updatedChecklist;
  },

  reorder: async (userId: string, data: ReorderChecklistInput) => {
    const checklist = await checklistRepository.findById(data.id);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRolePermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );
    if (!hasWorkspaceRolePermission) {
      throw new Error("Permission denied");
    }

    if (checklist.position === data.position) {
      return checklist;
    }

    const updatedChecklist = await checklistRepository.update(data.id, {
      position: data.position,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CHECKLISTS_REORDERED,
      entityType: ENTITY_TYPE.CHECKLIST,
      entityId: data.id,
      metadata: {
        oldPosition: checklist.position,
        newPosition: data.position,
      },
    });

    return updatedChecklist;
  },

  delete: async (userId: string, data: DeleteChecklistInput) => {
    const checklist = await checklistRepository.findById(data.id);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRolePermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );

    // const hasCardChecklistPermission = await checkUserGroupPermission(
    //   userId,
    //   card.board.workspaceId,
    //   PERMISSIONS.CARD_CHECKLIST
    // );

    // if (!hasWorkspaceRolePermission || !hasCardChecklistPermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRolePermission) {
      throw new Error("Permission denied");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CHECKLIST_DELETED,
      entityType: ENTITY_TYPE.CHECKLIST,
      entityId: data.id,
      metadata: { title: checklist.title },
    });

    await checklistRepository.delete(data.id);
  },
};
