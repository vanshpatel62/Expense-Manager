import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Import components
import Navbar from "./components/js/Navbar";
import Footer from "./components/js/Footer";
import HomePage from "./components/js/HomePage";
import AttendanceForm from "./components/js/AttendanceForm";
import StudentForm from './components/js/StudentForm';
import FacultySignupForm from './components/js/FacultySignupForm';
import StudentLoginForm from './components/js/StudentLoginForm';
import FacultyLoginForm from './components/js/FacultyLoginForm';
import FacultyAttendanceForm from './components/js/FacultyAttendanceForm';
import FacultyStudentView from './components/js/FacultyStudentView';
import ClassAttendanceForm from './components/js/ClassAttendanceForm';
import StudentDashboard from './components/js/StudentDashboard';
import StudentAttendanceChart from './components/js/StudentAttendanceChart';
import StudentEditProfile from './components/js/StudentEditProfile';
import FacultyEditProfile from './components/js/FacultyEditProfile';
import ViewAttendance from './components/js/ViewAttendance';
import StudentForgotPasswordForm from './components/js/StudentForgotPasswordForm';
import FacultyForgotPasswordForm from './components/js/FacultyForgotPasswordForm';
import AboutPage from './components/js/AboutPage';
import ContactPage from './components/js/ContactPage';

import StudentAttendanceSummary from './components/js/StudentAttendanceSummary';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/attendance" element={<AttendanceForm />} />
            <Route path="/student-signup" element={<StudentForm />} />
            <Route path="/faculty-signup" element={<FacultySignupForm />} />
            <Route path="/student-login" element={<StudentLoginForm />} />
            <Route path="/faculty-login" element={<FacultyLoginForm />} />
            <Route path="/faculty-attendance" element={<FacultyAttendanceForm />} />
            <Route path="/faculty-students" element={<FacultyStudentView />} />
            <Route path="/view-attendance" element={<ViewAttendance />} />
            <Route path="/class-attendance" element={<ClassAttendanceForm />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student/chart" element={<StudentAttendanceChart />} />
            <Route path="/student/edit-profile" element={<StudentEditProfile />} />
            <Route path="/faculty/edit-profile" element={<FacultyEditProfile />} />
            <Route path="/student-forgot-password" element={<StudentForgotPasswordForm />} />
            <Route path="/faculty-forgot-password" element={<FacultyForgotPasswordForm />} />
            <Route path="/student/attendance-summary" element={<StudentAttendanceSummary />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  
  );
}

export default App;
