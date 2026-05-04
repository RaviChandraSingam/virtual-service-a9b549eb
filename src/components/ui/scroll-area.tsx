import * as React from "react";
import { cn } from "@/lib/utils";

function ScrollArea({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-auto", className)}>
      {children}
    </div>
  );
}

function ScrollBar({ orientation }: { orientation?: string }) { return null; }

export { ScrollArea, ScrollBar };
