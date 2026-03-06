import { cn } from "@/utils/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#1e2035] dark:bg-[#1e2035]",
        className
      )}
      {...props}
    />
  );
}
