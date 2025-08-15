import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLoginOptions(!showLoginOptions);
    setShowSignupOptions(false);
  };

  const handleSignupClick = () => {
    setShowSignupOptions(!showSignupOptions);
    setShowLoginOptions(false);
  };

  const handleStudentLogin = () => {
    navigate('/student-login');
  };

  const handleFacultyLogin = () => {
    navigate('/faculty-login');
  };

  const handleStudentSignup = () => {
    navigate('/student-signup');
  };

  const handleFacultySignup = () => {
    navigate('/faculty-signup');
  };

  return (
    <div className="homepage">
      {/* Main Content */}
      <main className="homepage-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title"><span>Welcome</span> to Smart Attendance System</h1>
            <p className="hero-subtitle">
              Streamline attendance tracking with our advanced digital solution
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Why Choose Smart Attendance?</h2>
          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Analytics</h3>
              <p>Detailed attendance analytics and comprehensive</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>Faculty Dashboard</h3>
              <p>Advanced faculty interface for marking attendance and managing classes efficiently.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Real-time Updates</h3>
              <p>Instant attendance updates and real-time notifications for immediate feedback.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="about-content">
            <h2>About Our System</h2>
            <p>
              Smart Attendance System is a comprehensive digital solution designed to 
              revolutionize how educational institutions manage attendance. Our platform 
              provides seamless tracking, detailed analytics, and user-friendly interfaces 
              for both students and faculty members.
            </p>
            <div className="stats">
              <div className="stat-item">
                <h3>1000+</h3>
                <p>Students</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Faculty</p>
              </div>
              <div className="stat-item">
                <h3>99.9%</h3>
                <p>Accuracy</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage; 