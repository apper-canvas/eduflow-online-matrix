import React from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ value, onChange, placeholder = "Search...", className, ...props }) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={16} className="text-slate-400" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-4"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange({ target: { value: "" } })}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <ApperIcon name="X" size={16} className="text-slate-400 hover:text-slate-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;