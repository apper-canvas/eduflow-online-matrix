import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import AdvancedFilters from "@/components/molecules/AdvancedFilters";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StudentTable = ({ students = [], classes = [], onEdit, onDelete, onView, onAddStudent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filters, setFilters] = useState({});

  // Apply search and filters
  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch = !searchTerm || 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toString().includes(searchTerm);

    // Grade filter
    const matchesGrade = !filters.grade || student.grade?.toString() === filters.grade;

    // Class filter
    const matchesClass = !filters.class || student.classId === filters.class;

    return matchesSearch && matchesGrade && matchesClass;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === "name") {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    }
    
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

const getClassBadgeVariant = (className) => {
    // Handle undefined, null, or invalid className values
    if (!className || typeof className !== 'string') {
      return "primary";
    }
    
    // Check if className contains space before splitting
    if (!className.includes(" ")) {
      return "primary";
    }
    
    const classNumber = parseInt(className.split(" ")[1]) || 0;
    if (classNumber <= 5) return "primary";
    if (classNumber <= 8) return "info";
    return "success";
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Students</h2>
          <p className="text-sm text-slate-600">Manage student records and information</p>
        </div>
<div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-80"
              />
<Button 
                variant="primary" 
                className="whitespace-nowrap"
                onClick={onAddStudent}
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Student
              </Button>
            </div>
          </div>

          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            filterOptions={{
              grade: [...new Set(students.map(s => s.grade).filter(Boolean))].sort((a, b) => a - b),
              class: classes
            }}
            resultCount={filteredStudents.length}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  <span>Name</span>
                  <ApperIcon
                    name={sortField === "name" && sortDirection === "desc" ? "ChevronDown" : "ChevronUp"}
                    size={14}
                    className={cn(
                      "transition-colors duration-200",
                      sortField === "name" ? "text-primary-600" : "text-slate-400"
                    )}
                  />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-slate-700">Email</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-slate-700">Class</span>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort("enrollmentDate")}
                  className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  <span>Enrollment Date</span>
                  <ApperIcon
                    name={sortField === "enrollmentDate" && sortDirection === "desc" ? "ChevronDown" : "ChevronUp"}
                    size={14}
                    className={cn(
                      "transition-colors duration-200",
                      sortField === "enrollmentDate" ? "text-primary-600" : "text-slate-400"
                    )}
                  />
                </button>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-slate-700">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => (
              <tr
                key={student.Id}
                className={cn(
                  "border-b border-slate-100 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-slate-100/50 transition-all duration-200",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                )}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
<span className="text-sm font-medium text-primary-700">
                        {student.firstName?.[0] || '?'}{student.lastName?.[0] || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-slate-600">{student.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-900">{student.email}</span>
                </td>
                <td className="p-4">
                  <Badge variant={getClassBadgeVariant(student.className)}>
                    {student.className}
                  </Badge>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-600">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView && onView(student)}
                      className="text-slate-600 hover:text-primary-600"
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit && onEdit(student)}
                      className="text-slate-600 hover:text-accent-600"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete && onDelete(student.Id)}
                      className="text-slate-600 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedStudents.length === 0 && (
        <div className="text-center py-8">
          <ApperIcon name="Users" size={48} className="text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
          <p className="text-slate-600">
            {searchTerm ? "Try adjusting your search terms" : "Start by adding your first student"}
          </p>
        </div>
      )}
    </Card>
  );
};

export default StudentTable;