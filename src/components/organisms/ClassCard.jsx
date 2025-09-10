import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ClassCard = ({ classData, onEdit, onView, onManageStudents }) => {
  const getGradeBadgeVariant = (grade) => {
    if (grade <= 5) return "primary";
    if (grade <= 8) return "info";
    return "success";
  };

  return (
    <Card className="p-6 hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {classData.name} - {classData.section}
          </h3>
          <Badge variant={getGradeBadgeVariant(classData.grade)} className="mb-2">
            Grade {classData.grade}
          </Badge>
          <p className="text-sm text-slate-600">
            Academic Year: {classData.academicYear}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView && onView(classData)}
            className="text-slate-600 hover:text-primary-600"
          >
            <ApperIcon name="Eye" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit && onEdit(classData)}
            className="text-slate-600 hover:text-accent-600"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="User" size={16} className="text-slate-500" />
          <span className="text-sm text-slate-700">{classData.teacherName || "No teacher assigned"}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="Users" size={16} className="text-slate-500" />
          <span className="text-sm text-slate-700">
            {classData.studentCount || 0} / {classData.capacity} students
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="BookOpen" size={16} className="text-slate-500" />
          <span className="text-sm text-slate-700">
            {classData.subjects?.length || 0} subjects
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onManageStudents && onManageStudents(classData)}
          className="w-full"
        >
          <ApperIcon name="Users" size={16} className="mr-2" />
          Manage Students
        </Button>
      </div>
    </Card>
  );
};

export default ClassCard;