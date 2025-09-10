import React from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DateRangeFilter = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onPresetClick,
  className,
  showPresets = true,
  label = "Date Range"
}) => {
  const presets = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" }
  ];

  const handlePresetClick = (preset) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    switch (preset) {
      case "today":
        onStartDateChange({ target: { value: todayStr } });
        onEndDateChange({ target: { value: todayStr } });
        break;
      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        onStartDateChange({ target: { value: weekStart.toISOString().split("T")[0] } });
        onEndDateChange({ target: { value: weekEnd.toISOString().split("T")[0] } });
        break;
      case "month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        onStartDateChange({ target: { value: monthStart.toISOString().split("T")[0] } });
        onEndDateChange({ target: { value: monthEnd.toISOString().split("T")[0] } });
        break;
      default:
        break;
    }
    
    if (onPresetClick) {
      onPresetClick(preset);
    }
  };

  const clearDates = () => {
    onStartDateChange({ target: { value: "" } });
    onEndDateChange({ target: { value: "" } });
  };

  const hasDateRange = startDate || endDate;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {hasDateRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDates}
            className="text-red-600 hover:text-red-700 text-xs"
          >
            <ApperIcon name="X" size={12} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">From</label>
          <Input
            type="date"
            value={startDate}
            onChange={onStartDateChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">To</label>
          <Input
            type="date"
            value={endDate}
            onChange={onEndDateChange}
            className="w-full"
          />
        </div>
      </div>

      {showPresets && (
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <Button
              key={preset.value}
              variant="ghost"
              size="sm"
              onClick={() => handlePresetClick(preset.value)}
              className="text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}

      {hasDateRange && (
        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
          <ApperIcon name="Calendar" size={12} className="inline mr-1" />
          Filtering: {startDate && new Date(startDate).toLocaleDateString()} 
          {startDate && endDate && " - "} 
          {endDate && new Date(endDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;