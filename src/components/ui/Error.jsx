import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, variant = "default" }) => {
  const errorMessage = message || "Unable to load data at the moment";
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-slate-600 mb-6 max-w-md">{errorMessage}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" className="inline-flex items-center space-x-2">
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};

export default Error;