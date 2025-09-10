import React, { useEffect, useState } from "react";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import StudentTable from "@/components/organisms/StudentTable";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

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
const handleAddStudent = () => {
    setShowAddModal(true);
  };

  const handleView = (student) => {
    toast.info(`View student details: ${student.firstName} ${student.lastName}`);
  };

  // Student Form Modal Component
  const StudentFormModal = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      classId: '',
      parentContact: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const classOptions = [
      { value: 'CLS001', label: 'Grade 9' },
      { value: 'CLS002', label: 'Grade 10' },
      { value: 'CLS003', label: 'Grade 11' },
      { value: 'CLS004', label: 'Grade 12' },
      { value: 'CLS005', label: 'Grade 8' }
    ];

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error when user starts typing
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    const validateForm = () => {
      const errors = {};
      
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email format is invalid';
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
      }
      
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
      }
      
      if (!formData.address.trim()) {
        errors.address = 'Address is required';
      }
      
      if (!formData.classId) {
        errors.classId = 'Class selection is required';
      }
      
      if (!formData.parentContact.trim()) {
        errors.parentContact = 'Parent contact is required';
      }

      return errors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setSubmitting(true);
      try {
        const className = classOptions.find(option => option.value === formData.classId)?.label || '';
        const studentData = {
          ...formData,
          className
        };
        
        await studentService.create(studentData);
        toast.success('Student added successfully!');
        setShowAddModal(false);
        loadStudents(); // Refresh the list
      } catch (error) {
        console.error('Error creating student:', error);
        toast.error('Failed to add student. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    const handleCloseModal = () => {
      setShowAddModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        classId: '',
        parentContact: ''
      });
      setFormErrors({});
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={formErrors.firstName}
                  placeholder="Enter first name"
                />
                
                <FormField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={formErrors.lastName}
                  placeholder="Enter last name"
                />
              </div>

              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                placeholder="student@school.edu"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                  placeholder="(555) 123-4567"
                />
                
                <FormField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={formErrors.dateOfBirth}
                />
              </div>

              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={formErrors.address}
                placeholder="Enter full address"
              />

              <FormField
                label="Class"
                name="classId"
                type="select"
                value={formData.classId}
                onChange={handleInputChange}
                options={classOptions}
                error={formErrors.classId}
              />

              <FormField
                label="Parent Contact"
                name="parentContact"
                value={formData.parentContact}
                onChange={handleInputChange}
                error={formErrors.parentContact}
                placeholder="Parent Name - (555) 123-4567"
              />

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

if (students.length === 0) {
    return (
      <div>
        <Empty 
          title="No students enrolled"
          description="Start building your student database by enrolling your first student"
          actionLabel="Enroll Student"
          onAction={handleAddStudent}
          icon="Users"
        />
        {showAddModal && <StudentFormModal />}
      </div>
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
        onAddStudent={handleAddStudent}
      />
      {showAddModal && <StudentFormModal />}
    </div>
  );
};

export default Students;