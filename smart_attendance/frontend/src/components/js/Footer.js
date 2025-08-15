import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Footer.css";

function Footer() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">Smart Attendance</h3>
            <p className="footer-description">
              A modern attendance management system designed to streamline 
              student and faculty attendance tracking with advanced analytics 
              and reporting capabilities.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link">Home</a>
              </li>
              <li>
                <a href="/about" className="footer-link">About Us</a>
              </li>
              <li>
                <a href="/contact" className="footer-link">Contact</a>
              </li>
              <li>
                <a href="/student-login" className="footer-link">Student Login</a>
              </li>
              <li>
                <a href="/faculty-login" className="footer-link">Faculty Login</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Services</h4>
            <ul className="footer-links">
              <li>
                <span className="footer-link">Student Attendance</span>
              </li>
              <li>
                <span className="footer-link">Faculty Attendance</span>
              </li>
              <li>
                <span className="footer-link">Class Management</span>
              </li>
              <li>
                <span className="footer-link">Attendance Reports</span>
              </li>
              <li>
                <span className="footer-link">Analytics Dashboard</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt contact-icon"></i>
                <span>Ahmedabad , Gujarat</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone contact-icon"></i>
                <span>+91 9999999999</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope contact-icon"></i>
                <span>smartattendance@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock contact-icon"></i>
                <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Smart Attendance. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="bottom-link">Privacy Policy</a>
              <a href="#" className="bottom-link">Terms of Service</a>
              <a href="#" className="bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 