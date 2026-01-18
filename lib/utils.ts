import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  if (price === 0) return "Free";
  return `$${price}/month`;
};

export const getInitials = (user: any) => {
  if (user.name) {
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }
  return user.email?.substring(0, 2).toUpperCase() || "U";
};

type LabelStyle = {
  backgroundColor: string;
  borderColor: string;
  color: string;
  boxShadow: string;
};

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getModernLabelStyle(
  hex: string,
  options?: {
    bgAlpha?: number;
    borderAlpha?: number;
    textAlpha?: number;
  },
): LabelStyle {
  const { bgAlpha = 0.18, borderAlpha = 0.45, textAlpha = 0.9 } = options || {};

  return {
    backgroundColor: hexToRgba(hex, bgAlpha),
    borderColor: hexToRgba(hex, borderAlpha),
    color: hexToRgba(hex, textAlpha),
    boxShadow: `0 0 0 1px ${hexToRgba(hex, 0.25)}`,
  };
}
