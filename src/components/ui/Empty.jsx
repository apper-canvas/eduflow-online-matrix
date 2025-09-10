import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add New",
  onAction,
  icon = "FileX"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl">
      <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-8 max-w-sm">{description}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary" className="inline-flex items-center space-x-2">
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;