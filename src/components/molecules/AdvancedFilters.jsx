import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AdvancedFilters = ({ 
  filters = {}, 
  onFiltersChange, 
  filterOptions = {}, 
  className,
  showCount = true,
  resultCount = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value === "" ? undefined : value
    };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== ""
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-600 hover:text-slate-900"
          >
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="mr-2" 
            />
            Advanced Filters
            {hasActiveFilters && (
              <Badge variant="primary" className="ml-2 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              <ApperIcon name="X" size={14} className="mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {showCount && (
          <div className="text-sm text-slate-500">
            {resultCount} result{resultCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
          {filterOptions.grade && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Grade Level
              </label>
              <Select
                value={filters.grade || ""}
                onChange={(e) => handleFilterChange("grade", e.target.value)}
                className="w-full"
              >
                <option value="">All Grades</option>
                {filterOptions.grade.map(grade => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {filterOptions.class && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class
              </label>
              <Select
                value={filters.class || ""}
                onChange={(e) => handleFilterChange("class", e.target.value)}
                className="w-full"
              >
                <option value="">All Classes</option>
                {filterOptions.class.map(classItem => (
                  <option key={classItem.Id} value={classItem.classId}>
                    {classItem.name} - {classItem.section}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {filterOptions.subject && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject
              </label>
              <Select
                value={filters.subject || ""}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
                className="w-full"
              >
                <option value="">All Subjects</option>
                {filterOptions.subject.map(subject => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {filterOptions.department && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department
              </label>
              <Select
                value={filters.department || ""}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className="w-full"
              >
                <option value="">All Departments</option>
                {filterOptions.department.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {filterOptions.status && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <Select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full"
              >
                <option value="">All Statuses</option>
                {filterOptions.status.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;