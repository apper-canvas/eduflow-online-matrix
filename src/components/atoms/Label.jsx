import React from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "block text-sm font-medium text-slate-700 mb-1.5",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

export default Label;