import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { toast } from "react-toastify";

const Reports = () => {
  const [reportData, setReportData] = useState({
    students: [],
    classes: [],
    grades: [],
    attendance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("overview");
  const [selectedClass, setSelectedClass] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0]
  });

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      const [students, classes, grades, attendance] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setReportData({ students, classes, grades, attendance });
    } catch (error) {
      console.error("Error loading report data:", error);
      setError(error.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const generateOverviewStats = () => {
    const { students, classes, grades, attendance } = reportData;
    
    // Calculate grade averages
    const gradesBySubject = {};
    grades.forEach(grade => {
      if (!gradesBySubject[grade.subject]) {
        gradesBySubject[grade.subject] = [];
      }
      gradesBySubject[grade.subject].push((grade.marks / grade.maxMarks) * 100);
    });
    
    const subjectAverages = Object.entries(gradesBySubject).map(([subject, scores]) => ({
      subject,
      average: Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100,
      count: scores.length
    }));

    // Calculate attendance rates
    const attendanceByStatus = {
      Present: attendance.filter(a => a.status === "Present").length,
      Absent: attendance.filter(a => a.status === "Absent").length,
      Late: attendance.filter(a => a.status === "Late").length,
      Excused: attendance.filter(a => a.status === "Excused").length
    };
    
    const totalAttendance = Object.values(attendanceByStatus).reduce((sum, count) => sum + count, 0);
    const attendanceRate = totalAttendance > 0 ? 
      Math.round(((attendanceByStatus.Present + attendanceByStatus.Late + attendanceByStatus.Excused) / totalAttendance) * 100) : 0;

    return {
      totalStudents: students.length,
      totalClasses: classes.length,
      totalGrades: grades.length,
      totalAttendanceRecords: attendance.length,
      subjectAverages,
      attendanceRate,
      attendanceByStatus
    };
  };

  const generateClassReport = (classId) => {
    if (!classId) return null;
    
    const { students, grades, attendance } = reportData;
    const classStudents = students.filter(s => s.classId === classId);
    const classGrades = grades.filter(g => classStudents.some(s => s.Id === g.studentId));
    const classAttendance = attendance.filter(a => a.classId === classId);
    
    // Calculate class grade average
    const totalPercentages = classGrades.map(g => (g.marks / g.maxMarks) * 100);
    const classAverage = totalPercentages.length > 0 ? 
      Math.round((totalPercentages.reduce((sum, p) => sum + p, 0) / totalPercentages.length) * 100) / 100 : 0;
    
    // Calculate class attendance rate
    const presentCount = classAttendance.filter(a => a.status === "Present" || a.status === "Late" || a.status === "Excused").length;
    const classAttendanceRate = classAttendance.length > 0 ? 
      Math.round((presentCount / classAttendance.length) * 100) : 0;
    
    return {
      classId,
      studentCount: classStudents.length,
      gradeCount: classGrades.length,
      attendanceCount: classAttendance.length,
      averageGrade: classAverage,
      attendanceRate: classAttendanceRate,
      students: classStudents
    };
  };

  const handleGenerateReport = () => {
    toast.success(`${selectedReportType} report generated successfully!`);
  };

  const handleExportReport = (format) => {
    toast.info(`Exporting report as ${format.toUpperCase()}...`);
  };

  const stats = generateOverviewStats();
  const classReport = selectedClass ? generateClassReport(selectedClass) : null;

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReportData} />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Academic Reports
        </h1>
        <p className="text-slate-600">
          Generate comprehensive reports on student performance, attendance, and school statistics
        </p>
      </div>

      {/* Report Configuration */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Report Configuration</h2>
          <p className="text-sm text-slate-600">Configure your report parameters</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FormField
            label="Report Type"
            type="select"
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
          >
            <option value="overview">School Overview</option>
            <option value="class">Class Report</option>
            <option value="attendance">Attendance Report</option>
            <option value="grades">Grade Report</option>
          </FormField>
          
          {selectedReportType === "class" && (
            <FormField
              label="Select Class"
              type="select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Choose a class</option>
              {reportData.classes.map((classItem) => (
                <option key={classItem.Id} value={classItem.classId}>
                  {classItem.name} - {classItem.section} (Grade {classItem.grade})
                </option>
              ))}
            </FormField>
          )}
          
          <FormField
            label="Start Date"
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
          
          <FormField
            label="End Date"
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={handleGenerateReport}>
            <ApperIcon name="FileBarChart" size={16} className="mr-2" />
            Generate Report
          </Button>
          <Button variant="secondary" onClick={() => handleExportReport("pdf")}>
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export PDF
          </Button>
          <Button variant="secondary" onClick={() => handleExportReport("excel")}>
            <ApperIcon name="FileSpreadsheet" size={16} className="mr-2" />
            Export Excel
          </Button>
          <Button variant="ghost" onClick={() => handleExportReport("csv")}>
            <ApperIcon name="FileText" size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* School Overview Report */}
      {selectedReportType === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Users" size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Students</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl flex items-center justify-center">
                  <ApperIcon name="BookOpen" size={24} className="text-accent-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Classes</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalClasses}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                  <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl flex items-center justify-center">
                  <ApperIcon name="GraduationCap" size={24} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Grades</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalGrades}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Subject Performance */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Subject Performance</h3>
              <p className="text-sm text-slate-600">Average grades by subject</p>
            </div>
            
            {stats.subjectAverages.length > 0 ? (
              <div className="space-y-4">
                {stats.subjectAverages.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">{subject.subject}</h4>
                      <p className="text-sm text-slate-600">{subject.count} grades recorded</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{subject.average}%</p>
                      <Badge variant={subject.average >= 85 ? "success" : subject.average >= 70 ? "warning" : "danger"}>
                        {subject.average >= 85 ? "Excellent" : subject.average >= 70 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">No grade data available</p>
            )}
          </Card>

          {/* Attendance Breakdown */}
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Attendance Breakdown</h3>
              <p className="text-sm text-slate-600">Attendance statistics by status</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.attendanceByStatus).map(([status, count]) => (
                <div key={status} className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-sm font-medium text-slate-600">{status}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Class Report */}
      {selectedReportType === "class" && classReport && (
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Class Report: {classReport.classId}
            </h3>
            <p className="text-sm text-slate-600">Detailed performance metrics for selected class</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{classReport.studentCount}</p>
              <p className="text-sm font-medium text-slate-600">Students</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{classReport.averageGrade}%</p>
              <p className="text-sm font-medium text-slate-600">Average Grade</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{classReport.attendanceRate}%</p>
              <p className="text-sm font-medium text-slate-600">Attendance Rate</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{classReport.gradeCount}</p>
              <p className="text-sm font-medium text-slate-600">Total Grades</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Student List</h4>
            <div className="space-y-2">
              {classReport.students.map((student) => (
                <div key={student.Id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
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
                  <div className="text-right">
                    <p className="text-sm text-slate-600">ID: {student.Id}</p>
                    <p className="text-xs text-slate-500">
                      Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Other Report Types Placeholder */}
      {(selectedReportType === "attendance" || selectedReportType === "grades") && (
        <Card className="p-12 text-center">
          <ApperIcon name="FileBarChart" size={48} className="text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {selectedReportType === "attendance" ? "Attendance Report" : "Grade Report"}
          </h3>
          <p className="text-slate-600 mb-6">
            Detailed {selectedReportType} analysis and trends would be displayed here
          </p>
          <Button variant="primary" onClick={handleGenerateReport}>
            Generate {selectedReportType} Report
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Reports;