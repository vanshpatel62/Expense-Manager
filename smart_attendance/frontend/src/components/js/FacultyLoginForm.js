import React, { useState } from "react";
import axios from "axios";
import "../css/FacultyLoginForm.css";

function FacultyLoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
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
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    // Required fields
    if (!form.email.trim()) newErrors.email = "Email is required";
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
      const response = await axios.post("http://localhost:8000/api/faculty/login/", form);
      setMessage("Login successful! Redirecting to attendance form...");
      
      // Store faculty data in localStorage for attendance form
      localStorage.setItem('facultyData', JSON.stringify(response.data.faculty));
      
      // Redirect to attendance form after 2 seconds
      setTimeout(() => {
        window.location.href = '/faculty-attendance';
      }, 2000);
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Login failed. Please check your email and password.");
      }
    }
  };

  return (
    <div className="faculty-login-container">
      <h2>Faculty Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleChange} 
            placeholder="Email Address" 
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
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
        <a href="/faculty-forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
}

export default FacultyLoginForm; 