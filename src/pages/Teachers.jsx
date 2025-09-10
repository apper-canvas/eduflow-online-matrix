import React, { useEffect, useState } from "react";
import { teacherService } from "@/services/api/teacherService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import AdvancedFilters from "@/components/molecules/AdvancedFilters";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Teachers = () => {
const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    teacher_id_c: '',
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    phone_c: '',
    subjects_c: '',
    classes_assigned_c: '',
    employee_id_c: '',
    department_c: '',
    experience_c: ''
  });
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

const filteredTeachers = teachers.filter(teacher => {
    // Search filter
    const matchesSearch = !searchTerm || 
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));

    // Department filter
    const matchesDepartment = !filters.department || teacher.department === filters.department;

    // Subject filter
    const matchesSubject = !filters.subject || teacher.subjects.includes(filters.subject);

    return matchesSearch && matchesDepartment && matchesSubject;
  });

const handleEdit = (teacher) => {
    toast.info(`Edit teacher: ${teacher.firstName} ${teacher.lastName}`);
  };

  async function handleDelete(teacherId) {
    if (!confirm('Are you sure you want to delete this teacher?')) {
      return;
    }

    try {
      await teacherService.delete(teacherId);
      toast.success('Teacher deleted successfully');
      loadTeachers();
    } catch (error) {
      toast.error('Failed to delete teacher');
    }
  }

  const handleView = (teacher) => {
    toast.info(`View teacher profile: ${teacher.firstName} ${teacher.lastName}`);
  };

  const openAddTeacherModal = () => {
    setShowAddModal(true);
  };

  const closeAddTeacherModal = () => {
    setShowAddModal(false);
    setFormData({
      Name: '',
      teacher_id_c: '',
      first_name_c: '',
      last_name_c: '',
      email_c: '',
      phone_c: '',
      subjects_c: '',
      classes_assigned_c: '',
      employee_id_c: '',
      department_c: '',
      experience_c: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await teacherService.create(formData);
      toast.success('Teacher added successfully');
      closeAddTeacherModal();
      loadTeachers();
    } catch (error) {
      toast.error('Failed to add teacher');
      console.error('Error creating teacher:', error);
    } finally {
      setSubmitting(false);
    }
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
<div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-80"
              />
<Button variant="primary" onClick={openAddTeacherModal}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Teacher
              </Button>
            </div>
          </div>

          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            filterOptions={{
              department: [...new Set(teachers.map(t => t.department).filter(Boolean))].sort(),
              subject: [...new Set(teachers.flatMap(t => t.subjects).filter(Boolean))].sort()
            }}
            resultCount={filteredTeachers.length}
          />
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

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Teacher</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeAddTeacherModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher ID *
                  </label>
                  <input
                    type="text"
                    name="teacher_id_c"
                    value={formData.teacher_id_c}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name_c"
                    value={formData.first_name_c}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name_c"
                    value={formData.last_name_c}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email_c"
                    value={formData.email_c}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone_c"
                    value={formData.phone_c}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employee_id_c"
                    value={formData.employee_id_c}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department_c"
                    value={formData.department_c}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience_c"
                    value={formData.experience_c}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects (one per line)
                </label>
                <textarea
                  name="subjects_c"
                  value={formData.subjects_c}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mathematics&#10;Physics&#10;Chemistry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classes Assigned (one per line)
                </label>
                <textarea
                  name="classes_assigned_c"
                  value={formData.classes_assigned_c}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Grade 10A&#10;Grade 11B&#10;Grade 12C"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeAddTeacherModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="min-w-[120px]"
                >
                  {submitting ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Add Teacher
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;