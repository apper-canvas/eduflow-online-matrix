import React, { useState, useEffect } from "react";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
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
import { attendanceService } from "@/services/api/attendanceService";
import { toast } from "react-toastify";

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classesData, attendanceData] = await Promise.all([
        classService.getAll(),
        attendanceService.getAll()
      ]);
      setClasses(classesData);
      setAttendanceRecords(attendanceData);
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError(error.message || "Failed to load attendance data");
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

  const handleSubmitAttendance = async (attendanceEntries) => {
    try {
      await attendanceService.createBatch(attendanceEntries);
      const updatedAttendance = await attendanceService.getAll();
      setAttendanceRecords(updatedAttendance);
    } catch (error) {
      throw error;
    }
  };

  const getRecentAttendance = () => {
    return attendanceRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Present": return "success";
      case "Absent": return "danger";
      case "Late": return "warning";
      case "Excused": return "info";
      default: return "default";
    }
  };

  const getAttendanceStats = () => {
    const todayRecords = attendanceRecords.filter(record => record.date === selectedDate);
    const total = todayRecords.length;
    const present = todayRecords.filter(r => r.status === "Present").length;
    const absent = todayRecords.filter(r => r.status === "Absent").length;
    const late = todayRecords.filter(r => r.status === "Late").length;
    const excused = todayRecords.filter(r => r.status === "Excused").length;
    
    return { total, present, absent, late, excused };
  };

  const stats = getAttendanceStats();

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
          Attendance Management
        </h1>
        <p className="text-slate-600">
          Track student attendance, generate reports, and monitor patterns
        </p>
      </div>

      {/* Today's Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="XCircle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Late</p>
              <p className="text-2xl font-bold text-amber-600">{stats.late}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Excused</p>
              <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Class Selection */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Mark Attendance</h2>
          <p className="text-sm text-slate-600">Select a class to mark attendance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-96">
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
          
          <FormField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </Card>

      {/* Attendance Grid */}
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
            <AttendanceGrid 
              students={students}
              onSubmit={handleSubmitAttendance}
              selectedClass={selectedClass}
              selectedDate={selectedDate}
            />
          )}
        </div>
      )}

      {/* Recent Attendance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Attendance</h2>
            <p className="text-sm text-slate-600">Latest attendance records across all classes</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
            View All Records
            <ApperIcon name="ArrowRight" size={16} className="ml-1" />
          </Button>
        </div>

        {attendanceRecords.length === 0 ? (
          <Empty 
            title="No attendance records"
            description="Start tracking attendance by marking your first class"
            icon="Calendar"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Student</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Class</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-700">Period</th>
                </tr>
              </thead>
              <tbody>
                {getRecentAttendance().map((record, index) => (
                  <tr
                    key={record.Id}
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
                          Student ID: {record.studentId}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-slate-900">{record.classId}</span>
                    </td>
                    <td className="p-3">
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-slate-600">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-slate-600">{record.period}</span>
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

export default Attendance;