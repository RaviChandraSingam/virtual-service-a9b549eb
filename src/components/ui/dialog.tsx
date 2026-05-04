import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const DialogContext = React.createContext<DialogContextValue>({ open: false, onOpenChange: () => {} });

function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <DialogContext.Provider value={{ open: open ?? false, onOpenChange: onOpenChange ?? (() => {}) }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, asChild }: { children?: React.ReactNode; asChild?: boolean }) {
  const { onOpenChange } = React.useContext(DialogContext);
  return <span onClick={() => onOpenChange(true)}>{children}</span>;
}

function DialogContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  const { open, onOpenChange } = React.useContext(DialogContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          "relative z-50 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-xl",
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm text-muted-foreground opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col space-y-1.5 mb-4", className)}>{children}</div>;
}

function DialogTitle({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold text-foreground", className)}>{children}</h2>;
}

function DialogFooter({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-end gap-2 mt-4", className)}>{children}</div>;
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter };
