"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSheet } from "@/stores/sheet-store";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export const CustomSheet = () => {
  const { isOpen, close, data } = useSheet();
  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{data?.title}</SheetTitle>
          <SheetDescription>{data?.description}</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="p-4 overflow-auto">{data?.children}</div>
        {/* <ScrollArea className="h-[calc(100vh-100px)] p-4 w-full">
          </ScrollArea> */}
      </SheetContent>
    </Sheet>
  );
};
