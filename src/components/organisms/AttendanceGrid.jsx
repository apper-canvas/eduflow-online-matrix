import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const AttendanceGrid = ({ students = [], onSubmit, selectedClass, selectedDate }) => {
  const [attendance, setAttendance] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date().toISOString().split("T")[0]);

  useEffect(() => {
    // Initialize attendance state
    const initialAttendance = {};
    students.forEach(student => {
      initialAttendance[student.Id] = "Present";
    });
    setAttendance(initialAttendance);
  }, [students]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const attendanceEntries = students.map(student => ({
      studentId: student.Id,
      date: currentDate,
      status: attendance[student.Id] || "Present",
      classId: selectedClass || "CLS001",
      period: "All Day"
    }));

    setIsSubmitting(true);
    try {
      await onSubmit(attendanceEntries);
      toast.success(`Attendance saved for ${students.length} students`);
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAllAs = (status) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.Id] = status;
    });
    setAttendance(newAttendance);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Present": return "success";
      case "Absent": return "danger";
      case "Late": return "warning";
      case "Excused": return "info";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present": return "CheckCircle";
      case "Absent": return "XCircle";
      case "Late": return "Clock";
      case "Excused": return "Shield";
      default: return "Circle";
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      Present: 0,
      Absent: 0,
      Late: 0,
      Excused: 0
    };
    
    Object.values(attendance).forEach(status => {
      stats[status] = (stats[status] || 0) + 1;
    });
    
    return stats;
  };

  const stats = getAttendanceStats();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Attendance Tracking</h2>
        <p className="text-sm text-slate-600">
          Mark attendance for {selectedClass ? `Class ${selectedClass}` : "selected class"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="w-48">
            <FormField
              label="Date"
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              required
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Quick Actions:</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => markAllAs("Present")}
            >
              <ApperIcon name="CheckCircle" size={14} className="mr-1 text-green-600" />
              All Present
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => markAllAs("Absent")}
            >
              <ApperIcon name="XCircle" size={14} className="mr-1 text-red-600" />
              All Absent
            </Button>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([status, count]) => (
            <div key={status} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={getStatusIcon(status)} 
                  size={16} 
                  className={cn(
                    status === "Present" && "text-green-600",
                    status === "Absent" && "text-red-600",
                    status === "Late" && "text-amber-600",
                    status === "Excused" && "text-blue-600"
                  )}
                />
                <span className="text-sm font-medium text-slate-700">{status}</span>
              </div>
              <p className="text-lg font-bold text-slate-900 mt-1">{count}</p>
            </div>
          ))}
        </div>

        {/* Student Attendance Grid */}
        {students.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-medium text-slate-900">Student Attendance</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {students.map((student) => (
                <div key={student.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-slate-600">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {["Present", "Absent", "Late", "Excused"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleAttendanceChange(student.Id, status)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                          attendance[student.Id] === status
                            ? "bg-gradient-to-r shadow-md"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
                          attendance[student.Id] === status && status === "Present" && "from-green-500 to-green-600 text-white",
                          attendance[student.Id] === status && status === "Absent" && "from-red-500 to-red-600 text-white",
                          attendance[student.Id] === status && status === "Late" && "from-amber-500 to-amber-600 text-white",
                          attendance[student.Id] === status && status === "Excused" && "from-blue-500 to-blue-600 text-white"
                        )}
                      >
                        <ApperIcon name={getStatusIcon(status)} size={14} className="mr-1" />
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || students.length === 0}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Attendance
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AttendanceGrid;