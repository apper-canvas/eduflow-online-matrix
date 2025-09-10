import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const GradeEntryForm = ({ students = [], onSubmit, selectedClass }) => {
  const [formData, setFormData] = useState({
    subject: "",
    examType: "",
    maxMarks: 100,
    date: new Date().toISOString().split("T")[0]
  });
  const [grades, setGrades] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset grades when students change
    const initialGrades = {};
    students.forEach(student => {
      initialGrades[student.Id] = "";
    });
    setGrades(initialGrades);
  }, [students]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGradeChange = (studentId, marks) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: marks
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.examType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const gradeEntries = [];
    Object.entries(grades).forEach(([studentId, marks]) => {
      if (marks !== "" && marks !== null) {
        gradeEntries.push({
          studentId: parseInt(studentId),
          subject: formData.subject,
          marks: parseFloat(marks),
          maxMarks: parseFloat(formData.maxMarks),
          examType: formData.examType,
          date: formData.date,
          teacherId: "T001" // Mock teacher ID
        });
      }
    });

    if (gradeEntries.length === 0) {
      toast.error("Please enter grades for at least one student");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(gradeEntries);
      // Reset form
      setFormData({
        subject: "",
        examType: "",
        maxMarks: 100,
        date: new Date().toISOString().split("T")[0]
      });
      setGrades({});
      toast.success(`Grades entered for ${gradeEntries.length} students`);
    } catch (error) {
      toast.error("Failed to save grades");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePercentage = (marks) => {
    if (!marks || !formData.maxMarks) return 0;
    return ((parseFloat(marks) / parseFloat(formData.maxMarks)) * 100).toFixed(1);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-accent-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Grade Entry</h2>
        <p className="text-sm text-slate-600">
          Enter grades for {selectedClass ? `Class ${selectedClass}` : "selected class"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            label="Subject"
            type="select"
            value={formData.subject}
            onChange={(e) => handleFormChange("subject", e.target.value)}
            options={[
              { value: "Mathematics", label: "Mathematics" },
              { value: "English", label: "English" },
              { value: "Science", label: "Science" },
              { value: "History", label: "History" },
              { value: "Geography", label: "Geography" },
              { value: "Physics", label: "Physics" },
              { value: "Chemistry", label: "Chemistry" },
              { value: "Biology", label: "Biology" }
            ]}
            required
          />
          
          <FormField
            label="Exam Type"
            type="select"
            value={formData.examType}
            onChange={(e) => handleFormChange("examType", e.target.value)}
            options={[
              { value: "Quiz", label: "Quiz" },
              { value: "Test", label: "Test" },
              { value: "Midterm", label: "Midterm" },
              { value: "Final", label: "Final Exam" },
              { value: "Assignment", label: "Assignment" },
              { value: "Project", label: "Project" }
            ]}
            required
          />
          
          <FormField
            label="Max Marks"
            type="number"
            value={formData.maxMarks}
            onChange={(e) => handleFormChange("maxMarks", e.target.value)}
            min="1"
            max="1000"
            required
          />
          
          <FormField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleFormChange("date", e.target.value)}
            required
          />
        </div>

        {students.length > 0 && formData.subject && formData.examType && (
          <div className="space-y-4">
            <h3 className="text-md font-medium text-slate-900">Student Grades</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {students.map((student) => (
                <div key={student.Id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex-1 flex items-center space-x-3">
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
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={formData.maxMarks}
                        step="0.5"
                        value={grades[student.Id] || ""}
                        onChange={(e) => handleGradeChange(student.Id, e.target.value)}
                        placeholder="0"
                        className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      />
                      <span className="text-sm text-slate-600">/ {formData.maxMarks}</span>
                    </div>
                    
                    {grades[student.Id] && (
                      <div className="text-right min-w-[60px]">
                        <p className={`text-sm font-medium ${getGradeColor(calculatePercentage(grades[student.Id]))}`}>
                          {calculatePercentage(grades[student.Id])}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setGrades({});
              setFormData({
                subject: "",
                examType: "",
                maxMarks: 100,
                date: new Date().toISOString().split("T")[0]
              });
            }}
          >
            Clear All
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || students.length === 0}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Grades
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default GradeEntryForm;