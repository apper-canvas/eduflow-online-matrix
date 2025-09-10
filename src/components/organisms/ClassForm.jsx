import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { teacherService } from "@/services/api/teacherService";

const ClassForm = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    class_id_c: "",
    name_c: "",
    section_c: "",
    grade_c: "",
    teacher_id_c: "",
    teacher_name_c: "",
    capacity_c: "",
    student_count_c: "0",
    academic_year_c: "",
    subjects_c: ""
  });
  
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [errors, setErrors] = useState({});

  // Load teachers for dropdown
  useEffect(() => {
    if (isOpen) {
      loadTeachers();
    }
  }, [isOpen]);

  // Initialize form with edit data
  useEffect(() => {
    if (initialData) {
      setFormData({
        class_id_c: initialData.class_id_c || "",
        name_c: initialData.name_c || "",
        section_c: initialData.section_c || "",
        grade_c: initialData.grade_c?.toString() || "",
        teacher_id_c: initialData.teacher_id_c?.toString() || "",
        teacher_name_c: initialData.teacher_name_c || "",
        capacity_c: initialData.capacity_c?.toString() || "",
        student_count_c: initialData.student_count_c?.toString() || "0",
        academic_year_c: initialData.academic_year_c || "",
        subjects_c: Array.isArray(initialData.subjects) ? initialData.subjects.join('\n') : (initialData.subjects_c || "")
      });
    } else {
      // Reset form for new class
      setFormData({
        class_id_c: "",
        name_c: "",
        section_c: "",
        grade_c: "",
        teacher_id_c: "",
        teacher_name_c: "",
        capacity_c: "",
        student_count_c: "0",
        academic_year_c: "",
        subjects_c: ""
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const loadTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const teacherList = await teacherService.getAll();
      setTeachers(teacherList);
    } catch (error) {
      console.error("Error loading teachers:", error);
      toast.error("Failed to load teachers");
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleTeacherSelect = (e) => {
    const teacherId = e.target.value;
    const selectedTeacher = teachers.find(t => t.Id?.toString() === teacherId);
    
    setFormData(prev => ({
      ...prev,
      teacher_id_c: teacherId,
      teacher_name_c: selectedTeacher ? `${selectedTeacher.first_name_c || ""} ${selectedTeacher.last_name_c || ""}`.trim() : ""
    }));
    
    if (errors.teacher_id_c) {
      setErrors(prev => ({
        ...prev,
        teacher_id_c: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.class_id_c.trim()) {
      newErrors.class_id_c = "Class ID is required";
    }
    
    if (!formData.name_c.trim()) {
      newErrors.name_c = "Class name is required";
    }
    
    if (!formData.section_c.trim()) {
      newErrors.section_c = "Section is required";
    }
    
    if (!formData.grade_c) {
      newErrors.grade_c = "Grade is required";
    } else if (parseInt(formData.grade_c) < 1 || parseInt(formData.grade_c) > 12) {
      newErrors.grade_c = "Grade must be between 1 and 12";
    }
    
    if (!formData.academic_year_c.trim()) {
      newErrors.academic_year_c = "Academic year is required";
    }
    
    if (!formData.capacity_c) {
      newErrors.capacity_c = "Capacity is required";
    } else if (parseInt(formData.capacity_c) < 1) {
      newErrors.capacity_c = "Capacity must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSuccess(formData);
      toast.success(initialData ? "Class updated successfully!" : "Class created successfully!");
    } catch (error) {
      console.error("Error saving class:", error);
      toast.error(error.message || "Failed to save class");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-slate-900">
            {initialData ? "Edit Class" : "Create New Class"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
            className="text-slate-500 hover:text-slate-700"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class_id_c" className="text-sm font-medium text-slate-700">
                Class ID <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="class_id_c"
                name="class_id_c"
                value={formData.class_id_c}
                onChange={handleInputChange}
                className={`mt-1 ${errors.class_id_c ? 'border-red-500' : ''}`}
                placeholder="Enter class ID"
                disabled={loading}
              />
              {errors.class_id_c && (
                <p className="mt-1 text-sm text-red-600">{errors.class_id_c}</p>
              )}
            </div>

            <div>
              <Label htmlFor="name_c" className="text-sm font-medium text-slate-700">
                Class Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="name_c"
                name="name_c"
                value={formData.name_c}
                onChange={handleInputChange}
                className={`mt-1 ${errors.name_c ? 'border-red-500' : ''}`}
                placeholder="Enter class name"
                disabled={loading}
              />
              {errors.name_c && (
                <p className="mt-1 text-sm text-red-600">{errors.name_c}</p>
              )}
            </div>

            <div>
              <Label htmlFor="section_c" className="text-sm font-medium text-slate-700">
                Section <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="section_c"
                name="section_c"
                value={formData.section_c}
                onChange={handleInputChange}
                className={`mt-1 ${errors.section_c ? 'border-red-500' : ''}`}
                placeholder="Enter section (e.g., A, B, C)"
                disabled={loading}
              />
              {errors.section_c && (
                <p className="mt-1 text-sm text-red-600">{errors.section_c}</p>
              )}
            </div>

            <div>
              <Label htmlFor="grade_c" className="text-sm font-medium text-slate-700">
                Grade <span className="text-red-500">*</span>
              </Label>
              <Select
                id="grade_c"
                name="grade_c"
                value={formData.grade_c}
                onChange={handleInputChange}
                className={`mt-1 ${errors.grade_c ? 'border-red-500' : ''}`}
                disabled={loading}
              >
                <option value="">Select grade</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </Select>
              {errors.grade_c && (
                <p className="mt-1 text-sm text-red-600">{errors.grade_c}</p>
              )}
            </div>

            <div>
              <Label htmlFor="teacher_id_c" className="text-sm font-medium text-slate-700">
                Class Teacher
              </Label>
              <Select
                id="teacher_id_c"
                name="teacher_id_c"
                value={formData.teacher_id_c}
                onChange={handleTeacherSelect}
                className={`mt-1 ${errors.teacher_id_c ? 'border-red-500' : ''}`}
                disabled={loading || loadingTeachers}
              >
                <option value="">
                  {loadingTeachers ? "Loading teachers..." : "Select teacher"}
                </option>
                {teachers.map(teacher => (
                  <option key={teacher.Id} value={teacher.Id}>
                    {`${teacher.first_name_c || ""} ${teacher.last_name_c || ""}`.trim() || teacher.Name}
                  </option>
                ))}
              </Select>
              {errors.teacher_id_c && (
                <p className="mt-1 text-sm text-red-600">{errors.teacher_id_c}</p>
              )}
            </div>

            <div>
              <Label htmlFor="capacity_c" className="text-sm font-medium text-slate-700">
                Capacity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                id="capacity_c"
                name="capacity_c"
                value={formData.capacity_c}
                onChange={handleInputChange}
                className={`mt-1 ${errors.capacity_c ? 'border-red-500' : ''}`}
                placeholder="Enter class capacity"
                min="1"
                disabled={loading}
              />
              {errors.capacity_c && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity_c}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="academic_year_c" className="text-sm font-medium text-slate-700">
                Academic Year <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="academic_year_c"
                name="academic_year_c"
                value={formData.academic_year_c}
                onChange={handleInputChange}
                className={`mt-1 ${errors.academic_year_c ? 'border-red-500' : ''}`}
                placeholder="Enter academic year (e.g., 2023-2024)"
                disabled={loading}
              />
              {errors.academic_year_c && (
                <p className="mt-1 text-sm text-red-600">{errors.academic_year_c}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="subjects_c" className="text-sm font-medium text-slate-700">
              Subjects
            </Label>
            <textarea
              id="subjects_c"
              name="subjects_c"
              value={formData.subjects_c}
              onChange={handleInputChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter subjects (one per line)&#10;Mathematics&#10;English&#10;Science"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-slate-500">Enter each subject on a new line</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {initialData ? "Update Class" : "Create Class"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;