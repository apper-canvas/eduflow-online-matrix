import React, { useState, useEffect } from "react";
import StatsCard from "@/components/molecules/StatsCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { teacherService } from "@/services/api/teacherService";
import { announcementService } from "@/services/api/announcementService";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    teachers: 0,
    announcements: 0
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [quickStats, setQuickStats] = useState({
    todayAttendance: 95,
    avgGrade: 85,
    upcomingEvents: 3
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, classes, teachers, announcements] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        teacherService.getAll(),
        announcementService.getRecent(5)
      ]);
      
      setStats({
        students: students.length,
        classes: classes.length,
        teachers: teachers.length,
        announcements: announcements.length
      });
      
      setRecentAnnouncements(announcements);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High": return "danger";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "default";
    }
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-600">
          Welcome back! Here's what's happening at your school today.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.students}
          subtitle="Enrolled this year"
          icon="Users"
          gradient="primary"
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Active Classes"
          value={stats.classes}
          subtitle="Across all grades"
          icon="BookOpen"
          gradient="accent"
          trend="up"
          trendValue="+2"
        />
        <StatsCard
          title="Faculty Members"
          value={stats.teachers}
          subtitle="Teaching staff"
          icon="UserCheck"
          gradient="success"
        />
        <StatsCard
          title="Today's Attendance"
          value={`${quickStats.todayAttendance}%`}
          subtitle="Students present"
          icon="Calendar"
          gradient="warning"
          trend="up"
          trendValue="+2%"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Average Grade</p>
              <p className="text-2xl font-bold text-slate-900 mt-2 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {quickStats.avgGrade}%
              </p>
              <p className="text-sm text-green-600 mt-1">Above target</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-slate-900 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {quickStats.upcomingEvents}
              </p>
              <p className="text-sm text-slate-600 mt-1">This week</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Calendar" size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Announcements</p>
              <p className="text-2xl font-bold text-slate-900 mt-2 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {stats.announcements}
              </p>
              <p className="text-sm text-slate-600 mt-1">Recent posts</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
              <ApperIcon name="Megaphone" size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Announcements</h2>
              <p className="text-sm text-slate-600">Latest school updates and notices</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>

          {recentAnnouncements.length === 0 ? (
            <Empty 
              title="No announcements" 
              description="No recent announcements available"
              icon="Megaphone"
            />
          ) : (
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.Id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="Megaphone" size={14} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-slate-900 truncate">
                          {announcement.title}
                        </h3>
                        <Badge variant={getPriorityVariant(announcement.priority)} className="flex-shrink-0">
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center text-xs text-slate-500">
                        <span>{format(new Date(announcement.date), "MMM dd, yyyy")}</span>
                        <span className="mx-2">•</span>
                        <span>{announcement.targetAudience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-600">Frequently used administrative tasks</p>
          </div>

          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="UserPlus" size={16} className="mr-3" />
              Enroll New Student
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="Calendar" size={16} className="mr-3" />
              Mark Today's Attendance
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="GraduationCap" size={16} className="mr-3" />
              Enter Grades
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="FileBarChart" size={16} className="mr-3" />
              Generate Reports
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="Megaphone" size={16} className="mr-3" />
              Create Announcement
            </Button>
          </div>
        </Card>
      </div>

      {/* Today's Schedule Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Today's Overview</h2>
            <p className="text-sm text-slate-600">{format(new Date(), "EEEE, MMMM dd, yyyy")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <ApperIcon name="Clock" size={24} className="text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-slate-900">Classes in Session</h3>
            <p className="text-2xl font-bold text-blue-600">6</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <ApperIcon name="CheckCircle" size={24} className="text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-slate-900">Tasks Completed</h3>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
            <ApperIcon name="AlertCircle" size={24} className="text-amber-600 mx-auto mb-2" />
            <h3 className="font-medium text-slate-900">Pending Reviews</h3>
            <p className="text-2xl font-bold text-amber-600">4</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;