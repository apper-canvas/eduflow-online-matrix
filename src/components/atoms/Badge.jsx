import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 hover:from-primary-200 hover:to-primary-300",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 hover:from-amber-200 hover:to-amber-300",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;