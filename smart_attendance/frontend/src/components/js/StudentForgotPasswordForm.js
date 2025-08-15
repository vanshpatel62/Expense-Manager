import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/StudentForgotPasswordForm.css";

function StudentForgotPasswordForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    enrollment_nu: "",
    new_password: "",
    confirm_password: ""
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
    const passwordError = validatePassword(form.new_password);
    if (passwordError) newErrors.new_password = passwordError;

    // Confirm password validation
    const confirmPasswordError = validateConfirmPassword(form.new_password, form.confirm_password);
    if (confirmPasswordError) newErrors.confirm_password = confirmPasswordError;

    // Required fields
    if (!form.enrollment_nu.trim()) newErrors.enrollment_nu = "Enrollment number is required";
    if (!form.new_password) newErrors.new_password = "New password is required";
    if (!form.confirm_password) newErrors.confirm_password = "Confirm password is required";

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
      const response = await axios.post("http://localhost:8000/api/students/forgot-password/", form);
      setMessage("Password updated successfully! Redirecting to login...");
      
      // Redirect to student login after 3 seconds
      setTimeout(() => {
        navigate('/student-login');
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
    navigate('/student-login');
  };

  return (
    <div className="student-forgot-password-container">
      <h2>Reset Student Password</h2>
      <p className="instruction">Enter your enrollment number and new password to reset your account password.</p>
      
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
            name="new_password" 
            type="password" 
            value={form.new_password} 
            onChange={handleChange} 
            placeholder="New Password (min 6 characters)" 
            className={errors.new_password ? "error" : ""}
          />
          {errors.new_password && <span className="error-message">{errors.new_password}</span>}
        </div>

        <div className="form-group">
          <input 
            name="confirm_password" 
            type="password" 
            value={form.confirm_password} 
            onChange={handleChange} 
            placeholder="Confirm New Password" 
            className={errors.confirm_password ? "error" : ""}
          />
          {errors.confirm_password && <span className="error-message">{errors.confirm_password}</span>}
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

export default StudentForgotPasswordForm; 