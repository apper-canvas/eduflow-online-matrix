import React, { useState, useEffect } from "react";
import ClassCard from "@/components/organisms/ClassCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      console.error("Error loading classes:", error);
      setError(error.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleEdit = (classData) => {
    toast.info(`Edit class: ${classData.name} - ${classData.section}`);
  };

  const handleView = (classData) => {
    toast.info(`View class details: ${classData.name} - ${classData.section}`);
  };

  const handleManageStudents = (classData) => {
    toast.info(`Manage students for: ${classData.name} - ${classData.section}`);
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClasses} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Class Management
          </h1>
          <p className="text-slate-600">
            Organize classes, assign teachers, and manage student rosters
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <Empty 
          title="No classes created"
          description="Start organizing your school by creating your first class"
          actionLabel="Create Class"
          onAction={() => toast.info("Create class functionality would open here")}
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData) => (
            <ClassCard
              key={classData.Id}
              classData={classData}
              onEdit={handleEdit}
              onView={handleView}
              onManageStudents={handleManageStudents}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;