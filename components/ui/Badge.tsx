"use client";

import { cn } from "@/utils/cn";

interface BadgeProps {
  color: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ color, label, size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium text-white",
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
        },
        className
      )}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
