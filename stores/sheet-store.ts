import { create } from "zustand";
import { ReactNode } from "react";

interface SheetData {
  title: string;
  description?: string;
  children: ReactNode;
}

interface SheetStore {
  isOpen: boolean;
  data?: SheetData;
  open: (data: SheetData) => void;
  close: () => void;
}

export const useSheet = create<SheetStore>((set) => ({
  isOpen: false,
  data: undefined,
  open: (data) => set({ isOpen: true, data }),
  close: () => set({ isOpen: false, data: undefined }),
}));
