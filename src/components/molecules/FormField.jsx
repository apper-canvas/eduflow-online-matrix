import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  className, 
  children,
  options,
  onCustomAction,
  customActionLabel,
  ...props 
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label>{label}</Label>}
{type === "select" ? (
        <Select 
          error={error} 
          {...props}
          onChange={(e) => {
            if (e.target.value === '__custom_action__' && onCustomAction) {
              onCustomAction();
              // Reset the select to empty
              e.target.value = '';
            } else {
              props.onChange?.(e);
            }
          }}
        >
          <option value="">Select an option</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {onCustomAction && customActionLabel && (
            <option 
              value="__custom_action__" 
              className="font-medium text-primary-600 border-t border-slate-200"
            >
              + {customActionLabel}
            </option>
          )}
          {children}
        </Select>
      ) : (
        <Input type={type} error={error} {...props} />
      )}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;