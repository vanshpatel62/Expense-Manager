import React from "react";
import "../css/AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="hero-content">
          <h1>About Smart Attendance</h1>
          <p>Revolutionizing attendance management in educational institutions</p>
        </div>
      </div>

      <div className="about-container">
        {/* Mission Section */}
        <section className="about-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p>
              Smart Attendance is dedicated to transforming how educational institutions 
              manage and track attendance. We believe that efficient attendance management 
              is the foundation for academic success and institutional excellence.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="about-section features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3>Student Management</h3>
              <p>Comprehensive student registration and profile management with enrollment tracking.</p>
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
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Analytics & Reports</h3>
              <p>Detailed attendance analytics and comprehensive reporting for data-driven decisions.</p>
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

        

        {/* Technology Stack */}
        <section className="about-section tech-section">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <i className="fab fa-react"></i>
              <span>React.js</span>
            </div>

            <div className="tech-item">
              <i className="fab fa-python"></i>
              <span>Python</span>
            </div>

            <div className="tech-item">
              <i className="fab fa-django">
              <img src="https://cdn.simpleicons.org/django/007bff"  alt="Django"  style={{ height: '30px' }} />
              </i>
              <span>Django</span>
            </div>

            <div className="tech-item">
              <i className="fab fa-js"></i>
              <span>JavaScript</span>
            </div>

            <div className="tech-item">
              <i className="fab fa-css3-alt"></i>
              <span>CSS3</span>
            </div>

            <div className="tech-item">
              <i className="fab fa-html5"></i>
              <span>HTML5</span>
            </div>
            
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage; 