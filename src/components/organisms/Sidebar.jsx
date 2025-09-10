import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onToggle }) => {
  const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Classes", href: "/classes", icon: "BookOpen" },
    { name: "Teachers", href: "/teachers", icon: "UserCheck" },
    { name: "Grades", href: "/grades", icon: "GraduationCap" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Announcements", href: "/announcements", icon: "Megaphone" },
    { name: "Reports", href: "/reports", icon: "FileBarChart" },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-xl">
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-3 p-6 border-b border-slate-200">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              EduFlow
            </h1>
            <p className="text-xs text-slate-600">School Management</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm"
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={cn(
                      "transition-colors duration-200",
                      isActive ? "text-primary-600" : "text-slate-500 group-hover:text-slate-700"
                    )}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-600 truncate">admin@school.edu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  EduFlow
                </h1>
                <p className="text-xs text-slate-600">School Management</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} className="text-slate-600" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onToggle}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm"
                      : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      size={20}
                      className={cn(
                        "transition-colors duration-200",
                        isActive ? "text-primary-600" : "text-slate-500 group-hover:text-slate-700"
                      )}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
                <p className="text-xs text-slate-600 truncate">admin@school.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;