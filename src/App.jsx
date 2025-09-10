import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Classes from "@/pages/Classes";
import Teachers from "@/pages/Teachers";
import Grades from "@/pages/Grades";
import Attendance from "@/pages/Attendance";
import Announcements from "@/pages/Announcements";
import Reports from "@/pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="classes" element={<Classes />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="grades" element={<Grades />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;