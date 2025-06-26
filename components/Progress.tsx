import * as React from "react";
import { cn } from "@/lib/utils";

export const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full bg-gray-200 rounded-full", className)}
      {...props}
    >
      <div
        className="absolute h-full bg-blue-600 rounded-full transition-all"
        style={{ width: `${value || 0}%` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";
