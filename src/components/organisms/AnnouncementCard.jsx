import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AnnouncementCard = ({ announcement, onEdit, onDelete }) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High": return "danger";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "default";
    }
  };

  const getAudienceIcon = (audience) => {
    switch (audience) {
      case "All": return "Users";
      case "Teachers": return "UserCheck";
      case "Students": return "GraduationCap";
      case "Parents": return "Heart";
      default: return "Users";
    }
  };

  return (
    <Card className="p-6 hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
              {announcement.title}
            </h3>
            <Badge variant={getPriorityVariant(announcement.priority)}>
              {announcement.priority}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
              <span>{format(new Date(announcement.date), "MMM dd, yyyy")}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <ApperIcon name={getAudienceIcon(announcement.targetAudience)} size={14} />
              <span>{announcement.targetAudience}</span>
            </div>
            
            {announcement.classId && announcement.classId !== "ALL" && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="BookOpen" size={14} />
                <span>Class Specific</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit && onEdit(announcement)}
            className="text-slate-600 hover:text-accent-600"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete && onDelete(announcement.Id)}
            className="text-slate-600 hover:text-red-600"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-slate-700 leading-relaxed line-clamp-3">
          {announcement.content}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <ApperIcon name="User" size={14} />
          <span>By {announcement.authorName || "Admin"}</span>
        </div>
        
        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
          <span className="mr-1">Read More</span>
          <ApperIcon name="ArrowRight" size={14} />
        </Button>
      </div>
    </Card>
  );
};

export default AnnouncementCard;