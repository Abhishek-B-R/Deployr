import React from "react";
import { cn } from "@/lib/utils"; // Assuming utils exists, or we can inline a simple joiner

// Simple class merger if utility doesn't exist in this context
const cx = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

export const NeoCard = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      "bg-white border-4 border-neo-black shadow-neo-lg p-4 sm:p-6 relative",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const NeoButton = ({
  className,
  variant = "primary",
  size = "default",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
}) => {
  const base =
    "inline-flex items-center justify-center font-bold border-2 border-neo-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wide cursor-pointer";

  const variants = {
    primary:
      "bg-neo-yellow text-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
    secondary:
      "bg-neo-blue text-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
    outline:
      "bg-white text-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-gray-50",
    ghost:
      "border-transparent shadow-none hover:bg-neo-bg hover:border-neo-black",
  };

  const sizes = {
    default: "h-12 px-6 py-2 text-base",
    sm: "h-9 px-4 text-sm",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={cx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export const NeoBadge = ({
  children,
  color = "blue",
  className,
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "pink" | "yellow";
  className?: string;
}) => {
  const colors = {
    blue: "bg-neo-blue text-white",
    green: "bg-neo-green text-black",
    pink: "bg-neo-pink text-black",
    yellow: "bg-neo-yellow text-black",
  };

  return (
    <span
      className={cx(
        "px-3 py-1 text-xs font-black border-2 border-neo-black shadow-neo-sm uppercase",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
};
