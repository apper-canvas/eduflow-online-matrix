import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import LogoutButton from "@/components/atoms/LogoutButton";
const Header = ({ title, subtitle, onMenuToggle, showMenuToggle = true }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex relative">
            <ApperIcon name="Bell" size={20} className="text-slate-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
<div className="flex items-center space-x-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">User Profile</p>
                  <p className="text-xs text-slate-600">School Admin</p>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;