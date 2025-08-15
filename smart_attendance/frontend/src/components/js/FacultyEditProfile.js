import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/FacultyEditProfile.css";

function FacultyEditProfile() {
  const navigate = useNavigate();
  const [facultyData, setFacultyData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    new_password: "",
    confirm_password: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if faculty is logged in
    const storedData = localStorage.getItem('facultyData');
    if (!storedData) {
      navigate('/faculty-login');
      return;
    }

    const data = JSON.parse(storedData);
    setFacultyData(data);
    
    // Initialize form with current data
    setFormData({
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      new_password: "",
      confirm_password: ""
    });
    
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters (A-Z) and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Password validation (only if filled)
    if (formData.new_password || formData.confirm_password) {
      if (formData.new_password.length < 8) {
        newErrors.new_password = "Password must be at least 8 characters long";
      } else {
        if (!/[a-z]/.test(formData.new_password)) {
          newErrors.new_password = "Password must contain at least one lowercase letter";
        }
        if (!/[A-Z]/.test(formData.new_password)) {
          newErrors.new_password = "Password must contain at least one uppercase letter";
        }
        if (!/\d/.test(formData.new_password)) {
          newErrors.new_password = "Password must contain at least one number";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password)) {
          newErrors.new_password = "Password must contain at least one special character";
        }
      }
      if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      };
      
      if (formData.new_password) {
        payload.new_password = formData.new_password;
        payload.confirm_password = formData.confirm_password;
      }

      const response = await axios.put(
        `http://localhost:8000/api/faculty/update-profile/${facultyData.email}/`,
        payload
      );

      if (response.data.success) {
        // Update localStorage with new data
        const updatedFacultyData = {
          ...facultyData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        };
        localStorage.setItem('facultyData', JSON.stringify(updatedFacultyData));
        
        setMessage("Profile updated successfully!");
        setTimeout(() => {
          navigate('/faculty-attendance');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/faculty-attendance');
  };

  if (loading) {
    return (
      <div className="faculty-edit-profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="faculty-edit-profile-container">
      <div className="edit-profile-header">
        <div className="header-content">
          <h2>Edit Profile</h2>
          <p className="faculty-info">
            Welcome, <strong>{facultyData?.name}</strong>
          </p>
          <p className="email-info">
            Email: {facultyData?.email}
          </p>
        </div>
        <button className="back-button" onClick={handleCancel}>
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
      </div>

      <div className="edit-profile-content">
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                placeholder="Enter your 10-digit phone number"
                maxLength="10"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Change Password</h3>
            <p className="section-description">
              Leave password fields blank if you don't want to change your password.
            </p>
            
            <div className="form-group">
              <label htmlFor="new_password">New Password</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className={errors.new_password ? 'error' : ''}
                placeholder="Enter new password (leave blank to keep current)"
                autoComplete="new-password"
              />
              {errors.new_password && <span className="error-message">{errors.new_password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Confirm New Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={errors.confirm_password ? 'error' : ''}
                placeholder="Re-enter new password"
                autoComplete="new-password"
              />
              {errors.confirm_password && <span className="error-message">{errors.confirm_password}</span>}
            </div>

            <div className="password-requirements">
              <h4>Password Requirements:</h4>
              <ul>
                <li>At least 8 characters long</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
              </ul>
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="save-button">
              <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FacultyEditProfile; 