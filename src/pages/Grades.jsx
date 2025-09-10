import React, { useState, useEffect } from "react";
import GradeEntryForm from "@/components/organisms/GradeEntryForm";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { toast } from "react-toastify";

const Grades = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classesData, gradesData] = await Promise.all([
        classService.getAll(),
        gradeService.getAll()
      ]);
      setClasses(classesData);
      setGrades(gradesData);
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError(error.message || "Failed to load grade data");
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsByClass = async (classId) => {
    if (!classId) {
      setStudents([]);
      return;
    }
    
    try {
      setStudentsLoading(true);
      const studentsData = await studentService.getByClassId(classId);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("Failed to load students");
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadStudentsByClass(selectedClass);
  }, [selectedClass]);

  const handleSubmitGrades = async (gradeEntries) => {
    try {
      await gradeService.createBatch(gradeEntries);
      const updatedGrades = await gradeService.getAll();
      setGrades(updatedGrades);
    } catch (error) {
      throw error;
    }
  };

  const getRecentGrades = () => {
    return grades
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const getGradeColor = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-accent-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getExamTypeBadgeVariant = (examType) => {
    switch (examType) {
      case "Final": return "danger";
      case "Midterm": return "warning";
      case "Quiz": return "info";
      case "Test": return "primary";
      default: return "default";
    }
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadInitialData} />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Grade Management
        </h1>
        <p className="text-slate-600">
          Enter grades, track academic performance, and generate reports
        </p>
      </div>

      {/* Class Selection */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Select Class</h2>
          <p className="text-sm text-slate-600">Choose a class to enter grades</p>
        </div>
        
        <div className="w-64">
          <FormField
            label="Class"
            type="select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class</option>
            {classes.map((classItem) => (
              <option key={classItem.Id} value={classItem.classId}>
                {classItem.name} - {classItem.section} (Grade {classItem.grade})
              </option>
            ))}
          </FormField>
        </div>
      </Card>

      {/* Grade Entry Form */}
      {selectedClass && (
        <div>
          {studentsLoading ? (
            <Loading variant="default" />
          ) : students.length === 0 ? (
            <Card className="p-12 text-center">
              <ApperIcon name="Users" size={48} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No students in class</h3>
              <p className="text-slate-600">This class doesn't have any enrolled students</p>
            </Card>
          ) : (
            <GradeEntryForm 
              students={students}
              onSubmit={handleSubmitGrades}
              selectedClass={selectedClass}
            />
          )}
        </div>
      )}

      {/* Recent Grades */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Grades</h2>
            <p className="text-sm text-slate-600">Latest grade entries across all classes</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
            View All Grades
            <ApperIcon name="ArrowRight" size={16} className="ml-1" />
          </Button>
        </div>

        {grades.length === 0 ? (
          <Empty 
            title="No grades entered"
            description="Start tracking academic performance by entering your first grades"
            icon="GraduationCap"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Student</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Subject</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Grade</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Exam Type</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {getRecentGrades().map((grade, index) => (
                  <tr
                    key={grade.Id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={12} className="text-primary-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          Student ID: {grade.studentId}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-slate-900">{grade.subject}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${getGradeColor(grade.marks, grade.maxMarks)}`}>
                          {grade.marks}/{grade.maxMarks}
                        </span>
                        <span className={`text-xs ${getGradeColor(grade.marks, grade.maxMarks)}`}>
                          ({Math.round((grade.marks / grade.maxMarks) * 100)}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={getExamTypeBadgeVariant(grade.examType)}>
                        {grade.examType}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-slate-600">
                        {new Date(grade.date).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Grades;