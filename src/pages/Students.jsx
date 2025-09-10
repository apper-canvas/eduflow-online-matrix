import React, { useState, useEffect } from "react";
import StudentTable from "@/components/organisms/StudentTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
      setError(error.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleEdit = (student) => {
    toast.info(`Edit student: ${student.firstName} ${student.lastName}`);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        await loadStudents();
        toast.success("Student deleted successfully");
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleView = (student) => {
    toast.info(`View student details: ${student.firstName} ${student.lastName}`);
  };

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

  if (students.length === 0) {
    return (
      <Empty 
        title="No students enrolled"
        description="Start building your student database by enrolling your first student"
        actionLabel="Enroll Student"
        onAction={() => toast.info("Enroll student functionality would open here")}
        icon="Users"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Student Management
        </h1>
        <p className="text-slate-600">
          Manage student enrollment, profiles, and academic records
        </p>
      </div>

<StudentTable 
        students={students}
        classes={[]} // Will be enhanced when class data is needed
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
};

export default Students;