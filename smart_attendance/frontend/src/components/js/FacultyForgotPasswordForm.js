import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/FacultyForgotPasswordForm.css";

function FacultyForgotPasswordForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmpassword: ''
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
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword.trim()) {
      return "Confirm password is required";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Confirm password validation
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmpassword);
    if (confirmPasswordError) newErrors.confirmpassword = confirmPasswordError;

    // Required fields
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "New password is required";
    if (!formData.confirmpassword) newErrors.confirmpassword = "Confirm password is required";

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
      const payload = {
        email: formData.email,
        password: formData.password,
        confirmpassword: formData.confirmpassword
      };
      const response = await axios.post("http://localhost:8000/api/faculty/forgot-password/", payload);
      setMessage("Password updated successfully! Redirecting to login...");
      
      // Redirect to faculty login after 3 seconds
      setTimeout(() => {
        navigate('/faculty-login');
      }, 3000);
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Password update failed. Please try again.");
      }
    }
  };

  const handleBackToLogin = () => {
    navigate('/faculty-login');
  };

  return (
    <div className="faculty-forgot-password-container">
      <h2>Reset Faculty Password</h2>
      <p className="instruction">Enter your email address and new password to reset your account password.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address" 
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange} 
            placeholder="New Password (min 6 characters)" 
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <input 
            type="password"
            name="confirmpassword"
            value={formData.confirmpassword}
            onChange={handleChange} 
            placeholder="Confirm New Password" 
            className={errors.confirmpassword ? "error" : ""}
          />
          {errors.confirmpassword && <span className="error-message">{errors.confirmpassword}</span>}
        </div>

        <div className="button-group">
          <button type="submit">Reset Password</button>
          <button type="button" onClick={handleBackToLogin} className="back-button">Back to Login</button>
        </div>
      </form>
      
      {message && <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>}
    </div>
  );
}

export default FacultyForgotPasswordForm; 