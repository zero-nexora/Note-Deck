"use client";

import { useModal } from "@/stores/modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export const CustomModal = () => {
  const { isOpen, data, close } = useModal();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="flex flex-col max-h-[calc(100vh-100px)]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            {data?.title}
          </DialogTitle>
          {data?.description && (
            <DialogDescription>{data.description}</DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-300px)]">
          {data?.children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
