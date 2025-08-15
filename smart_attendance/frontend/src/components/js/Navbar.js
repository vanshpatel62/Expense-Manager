import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check for user data in localStorage
    const studentData = localStorage.getItem('studentData');
    const facultyData = localStorage.getItem('facultyData');
    
    if (studentData) {
      setUserData(JSON.parse(studentData));
      setUserType('student');
    } else if (facultyData) {
      setUserData(JSON.parse(facultyData));
      setUserType('faculty');
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('studentData');
    localStorage.removeItem('facultyData');
    setUserData(null);
    setUserType(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleUserClick = () => {
    console.log('User clicked, current dropdown state:', isDropdownOpen);
    console.log('User data:', userData);
    console.log('User type:', userType);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserDetails = () => {
    setIsDropdownOpen(false);
    if (userType === 'student') {
      navigate('/student-dashboard');
    } else if (userType === 'faculty') {
      navigate('/faculty-attendance');
    }
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Logo/Brand */}
        <div className="navbar-brand">
          <h2 onClick={() => navigate('/')} className="brand-text">
            Smart Attendance
          </h2>
        </div>

        {/* Center - Navigation Links */}
        <div className="navbar-links">
          <a 
            href="/" 
            className={`nav-link ${isActivePage('/') ? 'active' : ''}`}
          >
            Home
          </a>
          <a 
            href="/about" 
            className={`nav-link ${isActivePage('/about') ? 'active' : ''}`}
          >
            About
          </a>
          <a 
            href="/contact" 
            className={`nav-link ${isActivePage('/contact') ? 'active' : ''}`}
          >
            Contact
          </a>
          {!userData && (
            <>
              <a 
                href="/student-signup" 
                className={`nav-link ${isActivePage('/student-signup') ? 'active' : ''}`}
              >
                Student Register
              </a>
              <a 
                href="/faculty-signup" 
                className={`nav-link ${isActivePage('/faculty-signup') ? 'active' : ''}`}
              >
                Faculty Register
              </a>
            </>
          )}
        </div>

        {/* Right side - User Authentication */}
        <div className="navbar-auth">
          {userData ? (
            <div className="user-section" ref={dropdownRef}>
              <div className="user-info" onClick={handleUserClick}>
                <div className="user-avatar">
                  <i className={`fas fa-${userType === 'student' ? 'user-graduate' : 'chalkboard-teacher'}`}></i>
                </div>
                <span className="user-name">{userData.name}</span>
                <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} dropdown-icon`}></i>
              </div>
              
              {/* Always show dropdown for testing */}
              <div className="user-dropdown" style={{
                display: isDropdownOpen ? 'block' : 'none',
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '10px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                minWidth: '280px',
                zIndex: '1001'
              }}>
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <i className={`fas fa-${userType === 'student' ? 'user-graduate' : 'chalkboard-teacher'}`}></i>
                  </div>
                  <div className="dropdown-user-info">
                    <span className="dropdown-name">{userData.name}</span>
                    <span className="dropdown-email">
                      {userType === 'student' ? userData.enrollment_nu : userData.email}
                    </span>
                  </div>
                </div>
                
                <div className="dropdown-actions">
                  <button onClick={handleUserDetails} className="dropdown-action">
                    <i className="fas fa-user"></i>
                    View Profile
                  </button>
                  {userType === 'student' && (
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/student/edit-profile');
                      }} 
                      className="dropdown-action"
                    >
                      <i className="fas fa-edit"></i>
                      Edit Profile
                    </button>
                  )}
                  {userType === 'faculty' && (
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/faculty/edit-profile');
                      }} 
                      className="dropdown-action"
                    >
                      <i className="fas fa-edit"></i>
                      Edit Profile
                    </button>
                  )}
                  {userType === 'student' && (
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/student/chart');
                      }} 
                      className="dropdown-action"
                    >
                      <i className="fas fa-chart-pie"></i>
                      Attendance Chart
                    </button>
                  )}
                  {userType === 'faculty' && (
                    <>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/faculty-students');
                        }} 
                        className="dropdown-action"
                      >
                        <i className="fas fa-users"></i>
                        View Students
                      </button>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/view-attendance');
                        }} 
                        className="dropdown-action"
                      >
                        <i className="fas fa-chart-bar"></i>
                        View Attendance
                      </button>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/class-attendance');
                        }} 
                        className="dropdown-action"
                      >
                        <i className="fas fa-clipboard-check"></i>
                        Class Attendance
                      </button>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/student/attendance-summary');
                        }} 
                        className="dropdown-action"
                      >
                        <i className="fas fa-chart-line"></i>
                        Attendance Summary
                      </button>
                    </>
                  )}
                  <button onClick={handleLogout} className="dropdown-action logout">
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
                
              </div>
              
              
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                onClick={() => navigate('/student-login')} 
                className="auth-btn student-btn"
              >
                Student Login
              </button>
              <button 
                onClick={() => navigate('/faculty-login')} 
                className="auth-btn faculty-btn"
              >
                Faculty Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 