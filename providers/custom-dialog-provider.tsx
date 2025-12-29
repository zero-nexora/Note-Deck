"use client";

import { CustomConfirm } from "@/components/modals/custom-confirm";
import { CustomModal } from "@/components/modals/custom-modal";
import { CustomSheet } from "@/components/modals/custom-sheet";
import { useEffect, useState } from "react";

export const CustomDialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const onMount = () => setIsMounted(true);
    onMount();
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CustomConfirm />
      <CustomModal />
      <CustomSheet />
    </>
  );
};
