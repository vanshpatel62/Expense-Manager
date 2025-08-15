import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/StudentLoginForm.css";

function StudentLoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    enrollment_nu: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Validation functions
  const validateEnrollmentNumber = (enrollment_nu) => {
    const enrollmentRegex = /^\d{14}$/;
    if (!enrollmentRegex.test(enrollment_nu)) {
      return "Enrollment number must be exactly 14 digits";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Password is required";
    }
    return "";
  };

  const handleChange = e => {
    const { name, value } = e.target;
    
    // For enrollment number, only allow digits
    if (name === 'enrollment_nu') {
      const numericValue = value.replace(/\D/g, '');
      setForm(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Enrollment number validation
    const enrollmentError = validateEnrollmentNumber(form.enrollment_nu);
    if (enrollmentError) newErrors.enrollment_nu = enrollmentError;

    // Password validation
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    // Required fields
    if (!form.enrollment_nu.trim()) newErrors.enrollment_nu = "Enrollment number is required";
    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Please fix the errors above");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/students/login/", form);
      setMessage("Login successful! Redirecting to dashboard...");
      
      // Store student data in localStorage
      localStorage.setItem('studentData', JSON.stringify(response.data.student));
      
      // Redirect to student dashboard after 2 seconds
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 2000);
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Login failed. Please check your enrollment number and password.");
      }
    }
  };

  return (
    <div className="student-login-container">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            name="enrollment_nu" 
            value={form.enrollment_nu} 
            onChange={handleChange} 
            placeholder="Enrollment Number (14 digits)" 
            maxLength="14"
            className={errors.enrollment_nu ? "error" : ""}
          />
          {errors.enrollment_nu && <span className="error-message">{errors.enrollment_nu}</span>}
        </div>

        <div className="form-group">
          <input 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            placeholder="Password" 
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit">Login</button>
      </form>
      {message && <p className={message.includes("successful") ? "success-message" : "error-message"}>{message}</p>}
      
      <div className="forgot-password-link">
        <a href="/student-forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
}

export default StudentLoginForm;