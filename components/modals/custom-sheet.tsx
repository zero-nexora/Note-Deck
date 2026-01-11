"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSheet } from "@/stores/sheet-store";
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
        <div className="p-2 overflow-auto">{data?.children}</div>
      </SheetContent>
    </Sheet>
  );
};
