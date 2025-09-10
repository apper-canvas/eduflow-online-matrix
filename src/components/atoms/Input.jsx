import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;