import React, { useEffect, useMemo, useState } from "react";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";
import ClassForm from "@/components/organisms/ClassForm";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import AdvancedFilters from "@/components/molecules/AdvancedFilters";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ClassCard from "@/components/organisms/ClassCard";

const Classes = () => {
const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showClassForm, setShowClassForm] = useState(false);
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

  const filteredClasses = useMemo(() => {
    let filtered = classes || [];

    // Apply search filter
    if (searchTerm?.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(classData => 
        classData?.name?.toLowerCase().includes(search) ||
        classData?.subject?.toLowerCase().includes(search) ||
        classData?.section?.toLowerCase().includes(search)
      );
    }

    // Apply advanced filters
    if (filters && Object.keys(filters).length > 0) {
      filtered = filtered.filter(classData => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return true;
          }
          if (Array.isArray(value)) {
            return value.includes(classData?.[key]);
          }
          return classData?.[key] === value;
        });
      });
    }

    return filtered;
  }, [classes, searchTerm, filters]);

const handleEdit = (classData) => {
    toast.info(`Edit class: ${classData.name} - ${classData.section}`);
  };

  const handleView = (classData) => {
    toast.info(`View class details: ${classData.name} - ${classData.section}`);
  };

  const handleManageStudents = (classData) => {
    toast.info(`Manage students for: ${classData.name} - ${classData.section}`);
  };

  const handleCreateClass = () => {
    setShowClassForm(true);
  };

  const handleCloseForm = () => {
    setShowClassForm(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      await classService.create(formData);
      await loadClasses(); // Refresh the classes list
      setShowClassForm(false);
    } catch (error) {
      throw error; // Re-throw to let form handle the error display
    }
  };
  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClasses} />;
  }

return (
    <>
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
          <Button variant="primary" onClick={handleCreateClass}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Class
          </Button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search classes by name or subject..."
                className="w-80"
              />
              <Button variant="primary" onClick={handleCreateClass}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Class
              </Button>
            </div>
          </div>

          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            filterOptions={{
              grade: [...new Set(classes.map(c => c.grade).filter(Boolean))].sort((a, b) => a - b),
              subject: [...new Set(classes.map(c => c.subject).filter(Boolean))].sort()
            }}
            resultCount={filteredClasses.length}
          />

          {filteredClasses.length === 0 ? (
            searchTerm || Object.keys(filters).some(key => filters[key]) ? (
              <Empty 
                title="No classes found"
                description="Try adjusting your search or filter criteria"
                actionLabel="Clear Filters"
                onAction={() => {
                  setSearchTerm("");
                  setFilters({});
                }}
                icon="Search"
              />
            ) : (
              <Empty 
                title="No classes created"
                description="Start organizing your school by creating your first class"
                actionLabel="Create Class"
                onAction={handleCreateClass}
                icon="BookOpen"
              />
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classData) => (
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
      </div>

      <ClassForm
        isOpen={showClassForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSubmit}
      />
    </>
  );
};

export default Classes;