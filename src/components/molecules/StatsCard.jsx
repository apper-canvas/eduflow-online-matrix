import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = "primary"
}) => {
  const gradients = {
    primary: "from-primary-50 to-primary-100",
    accent: "from-accent-50 to-accent-100",
    success: "from-green-50 to-green-100",
    warning: "from-amber-50 to-amber-100",
    danger: "from-red-50 to-red-100",
  };

  const iconColors = {
    primary: "text-primary-600",
    accent: "text-accent-600", 
    success: "text-green-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  };

  return (
    <Card className={cn("p-6 hover:scale-[1.02] transition-all duration-300", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center space-x-1 mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={14} 
                className={trend === "up" ? "text-green-600" : "text-red-600"}
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
            gradients[gradient]
          )}>
            <ApperIcon name={icon} size={24} className={iconColors[gradient]} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;