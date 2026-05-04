import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  className?: string;
}

const variantMap: Record<string, MuiButtonProps["variant"]> = {
  default: "contained",
  destructive: "contained",
  outline: "outlined",
  secondary: "outlined",
  ghost: "text",
  link: "text",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className, children, asChild, ...props }, ref) => {
    if (size === "icon") {
      return (
        <IconButton ref={ref} size="small" {...(props as any)}>
          {children}
        </IconButton>
      );
    }
    return (
      <MuiButton
        ref={ref}
        variant={variantMap[variant] || "contained"}
        size={size === "sm" ? "small" : size === "lg" ? "large" : "medium"}
        color={variant === "destructive" ? "error" : "primary"}
        {...(props as any)}
      >
        {children}
      </MuiButton>
    );
  }
);
Button.displayName = "Button";

export function buttonVariants({ variant = "default" }: { variant?: string } = {}) {
  return variant;
}
