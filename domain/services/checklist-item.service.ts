import { checkBoardPermission } from "@/lib/check-permissions";
import { cardRepository } from "../repositories/card.repository";
import { checklistItemRepository } from "../repositories/checklist-item.repository";
import { checklistRepository } from "../repositories/checklist.repository";
import {
  CreateChecklistItemInput,
  DeleteChecklistItemInput,
  ReorderChecklistItemInput,
  ToggleChecklistItemInput,
  UpdateChecklistItemInput,
} from "../schemas/checklist-item.schema";
import { activityRepository } from "../repositories/activity.repository";
import { executeAutomations } from "./automation.service";
import { ACTIVITY_ACTION, ENTITY_TYPE, ROLE } from "@/lib/constants";

export const checklistItemService = {
  create: async (userId: string, data: CreateChecklistItemInput) => {
    const checklist = await checklistRepository.findById(data.checklistId);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedText = data.text.trim();
    if (!trimmedText) {
      throw new Error("Checklist item text cannot be empty");
    }

    const maxPosition = await checklistItemRepository.getMaxPosition(
      data.checklistId
    );

    const item = await checklistItemRepository.create({
      ...data,
      text: trimmedText,
      position: maxPosition + 1,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CHECKLIST_ITEM_CREATED,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      entityId: item.id,
      metadata: { text: item.text },
    });

    return item;
  },

  toggle: async (userId: string, data: ToggleChecklistItemInput) => {
    const item = await checklistItemRepository.findById(data.id);
    if (!item) {
      throw new Error("Checklist item not found");
    }

    const checklist = await checklistRepository.findById(item.checklistId);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    if (item.isCompleted === data.isCompleted) {
      return item;
    }

    const updatedItem = await checklistItemRepository.update(data.id, {
      isCompleted: data.isCompleted,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: data.isCompleted
        ? ACTIVITY_ACTION.CHECKLIST_ITEM_COMPLETED
        : ACTIVITY_ACTION.CHECKLIST_ITEM_UNCOMPLETED,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      entityId: updatedItem.id,
      metadata: {
        text: item.text,
        isCompleted: data.isCompleted,
      },
    });

    if (data.isCompleted) {
      // await executeAutomations({
      //   type: "CHECKLIST_ITEM_COMPLETED",
      //   boardId: card.boardId,
      //   cardId: card.id,
      //   checklistId: checklist.id,
      //   userId,
      // });

      const allItems = await checklistItemRepository.findByChecklistId(
        checklist.id
      );
      const allCompleted = allItems.every((item) => item.isCompleted);

      if (allCompleted && allItems.length > 0) {
        // await executeAutomations({
        //   type: "CHECKLIST_COMPLETED",
        //   boardId: card.boardId,
        //   cardId: card.id,
        //   checklistId: checklist.id,
        //   userId,
        // });
      }
    }

    return updatedItem;
  },

  update: async (
    userId: string,
    itemId: string,
    data: UpdateChecklistItemInput
  ) => {
    const item = await checklistItemRepository.findById(itemId);
    if (!item) {
      throw new Error("Checklist item not found");
    }

    const checklist = await checklistRepository.findById(item.checklistId);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.text !== undefined) {
      const trimmedText = data.text.trim();
      if (!trimmedText) {
        throw new Error("Checklist item text cannot be empty");
      }
      updateData.text = trimmedText;

      if (item.text === trimmedText) {
        return item;
      }
    }

    const updatedItem = await checklistItemRepository.update(
      itemId,
      updateData
    );

    const metadata: Record<string, any> = {};
    if (data.text !== undefined) {
      metadata.oldText = item.text;
      metadata.newText = updateData.text;
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CHECKLIST_ITEM_UPDATED,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      entityId: updatedItem.id,
      metadata,
    });

    return updatedItem;
  },

  reorder: async (userId: string, data: ReorderChecklistItemInput) => {
    const item = await checklistItemRepository.findById(data.id);
    if (!item) {
      throw new Error("Checklist item not found");
    }

    const checklist = await checklistRepository.findById(item.checklistId);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    if (item.position === data.position) {
      return item;
    }

    const updatedItem = await checklistItemRepository.update(data.id, {
      position: data.position,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CHECKLIST_ITEMS_REORDERED,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      entityId: data.id,
      metadata: {
        oldPosition: item.position,
        newPosition: data.position,
      },
    });

    return updatedItem;
  },

  delete: async (userId: string, data: DeleteChecklistItemInput) => {
    const item = await checklistItemRepository.findById(data.id);
    if (!item) {
      throw new Error("Checklist item not found");
    }

    const checklist = await checklistRepository.findById(item.checklistId);
    if (!checklist) {
      throw new Error("Checklist not found");
    }

    const card = await cardRepository.findById(checklist.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.CHECKLIST_ITEM_DELETED,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      entityId: data.id,
      metadata: { text: item.text },
    });

    await checklistItemRepository.delete(data.id);
  },
};
