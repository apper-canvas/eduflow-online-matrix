import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { teacherService } from "@/services/api/teacherService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (error) {
      console.error("Error loading teachers:", error);
      setError(error.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (teacher) => {
    toast.info(`Edit teacher: ${teacher.firstName} ${teacher.lastName}`);
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await teacherService.delete(teacherId);
        await loadTeachers();
        toast.success("Teacher deleted successfully");
      } catch (error) {
        toast.error("Failed to delete teacher");
      }
    }
  };

  const handleView = (teacher) => {
    toast.info(`View teacher profile: ${teacher.firstName} ${teacher.lastName}`);
  };

  const getDepartmentColor = (department) => {
    const colors = {
      "Mathematics": "primary",
      "English": "success",
      "Science": "info",
      "Social Studies": "warning",
      "Arts": "danger"
    };
    return colors[department] || "default";
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTeachers} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Teacher Management
          </h1>
          <p className="text-slate-600">
            Manage faculty profiles, assignments, and academic responsibilities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teachers..."
            className="w-64"
          />
          <Button variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {teachers.length === 0 ? (
        <Empty 
          title="No teachers added"
          description="Start building your faculty by adding your first teacher"
          actionLabel="Add Teacher"
          onAction={() => toast.info("Add teacher functionality would open here")}
          icon="UserCheck"
        />
      ) : filteredTeachers.length === 0 ? (
        <Card className="p-12 text-center">
          <ApperIcon name="Search" size={48} className="text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No teachers found</h3>
          <p className="text-slate-600">Try adjusting your search terms</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.Id} className="p-6 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary-700">
                      {teacher.firstName[0]}{teacher.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-sm text-slate-600">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(teacher)}
                    className="text-slate-600 hover:text-primary-600"
                  >
                    <ApperIcon name="Eye" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(teacher)}
                    className="text-slate-600 hover:text-accent-600"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(teacher.Id)}
                    className="text-slate-600 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="IdCard" size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-700">ID: {teacher.employeeId}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-700">{teacher.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Building" size={16} className="text-slate-500" />
                  <Badge variant={getDepartmentColor(teacher.department)}>
                    {teacher.department}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-700">{teacher.experience} years experience</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Subjects:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map((subject, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Classes Assigned:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.classesAssigned.map((classId, index) => (
                    <Badge key={index} variant="info" className="text-xs">
                      {classId}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleView(teacher)}
                  className="w-full"
                >
                  <ApperIcon name="User" size={16} className="mr-2" />
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teachers;