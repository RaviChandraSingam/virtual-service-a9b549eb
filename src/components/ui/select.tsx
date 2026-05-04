import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectContextValue {
  value: string;
  onValueChange?: (v: string) => void;
}
const SelectContext = React.createContext<SelectContextValue>({ value: "" });

function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <SelectContext.Provider value={{ value: value ?? "", onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

// SelectTrigger and SelectValue are consumed by SelectContent - kept for API compat
function SelectTrigger({ children, className }: { children?: React.ReactNode; className?: string }) {
  return null;
}
function SelectValue({ placeholder }: { placeholder?: string }) {
  return null;
}

function SelectContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  const { value, onValueChange } = React.useContext(SelectContext);

  // Collect option values from SelectItem children
  const options: { value: string; label: React.ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const p = child.props as any;
      options.push({ value: p.value, label: p.children });
    }
  });

  return (
    <div className={cn("relative w-full", className)}>
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "flex h-9 w-full appearance-none rounded-md border border-input bg-secondary px-3 py-1 pr-8 text-sm text-foreground shadow-sm",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function SelectItem({ value, children }: { value: string; children?: React.ReactNode }) {
  return null; // consumed by SelectContent
}

function SelectGroup({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
function SelectLabel({ children }: { children?: React.ReactNode }) {
  return null;
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel };
