import React from "react";

const Loading = ({ variant = "default" }) => {
  if (variant === "table") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex space-x-4">
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/6"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/4"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/6"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/4"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/6"></div>
          </div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/6"></div>
                <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/4"></div>
                <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/6"></div>
                <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/4"></div>
                <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
                  <div className="h-8 w-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
                </div>
                <div className="mt-4">
                  <div className="h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-accent-500 rounded-full animate-spin animate-pulse opacity-60"></div>
      </div>
    </div>
  );
};

export default Loading;