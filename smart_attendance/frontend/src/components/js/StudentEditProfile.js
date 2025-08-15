import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/StudentEditProfile.css";

function StudentEditProfile() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    roll_nu: "",
    date_of_birth: "",
    new_password: "",
    confirm_password: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if student is logged in
    const storedData = localStorage.getItem('studentData');
    if (!storedData) {
      navigate('/student-login');
      return;
    }

    const data = JSON.parse(storedData);
    setStudentData(data);
    
    // Initialize form with current data
    setFormData({
      name: data.name || "",
      roll_nu: data.roll_nu || "",
      date_of_birth: data.date_of_birth || ""
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.roll_nu.trim()) {
      newErrors.roll_nu = "Roll number is required";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    } else {
      const selectedDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date_of_birth = "Date of birth cannot be in the future";
      }
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
        roll_nu: formData.roll_nu.trim(),
        date_of_birth: formData.date_of_birth
      };
      if (formData.new_password) {
        payload.new_password = formData.new_password;
        payload.confirm_password = formData.confirm_password;
      }
      const response = await axios.put(
        `http://localhost:8000/api/students/update-profile/${studentData.enrollment_nu}/`,
        payload
      );

      if (response.data.success) {
        // Update localStorage with new data
        const updatedStudentData = {
          ...studentData,
          name: formData.name.trim(),
          roll_nu: formData.roll_nu.trim(),
          date_of_birth: formData.date_of_birth
        };
        localStorage.setItem('studentData', JSON.stringify(updatedStudentData));
        
        setMessage("Profile updated successfully!");
        setTimeout(() => {
          navigate('/student-dashboard');
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
    navigate('/student-dashboard');
  };

  if (loading) {
    return (
      <div className="student-edit-profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="student-edit-profile-container">
      <div className="edit-profile-header">
        <div className="header-content">
          <h2>Edit Profile</h2>
          <p className="student-info">
            Welcome, <strong>{studentData?.name}</strong>
          </p>
          <p className="enrollment-info">
            Enrollment: {studentData?.enrollment_nu}
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
              <label htmlFor="roll_nu">Roll Number *</label>
              <input
                type="text"
                id="roll_nu"
                name="roll_nu"
                value={formData.roll_nu}
                onChange={handleChange}
                className={errors.roll_nu ? 'error' : ''}
                placeholder="Enter your roll number"
              />
              {errors.roll_nu && <span className="error-message">{errors.roll_nu}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth">Date of Birth *</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={errors.date_of_birth ? 'error' : ''}
              />
              {errors.date_of_birth && <span className="error-message">{errors.date_of_birth}</span>}
            </div>

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

            <div className="readonly-fields">
              <div className="form-group">
                <label>Enrollment Number</label>
                <input
                  type="text"
                  value={studentData?.enrollment_nu || ""}
                  readOnly
                  className="readonly"
                />
                <small>Enrollment number cannot be changed</small>
              </div>

              <div className="form-group">
                <label>Branch</label>
                <input
                  type="text"
                  value={studentData?.branch || ""}
                  readOnly
                  className="readonly"
                />
              </div>

              <div className="form-group">
                <label>Batch</label>
                <input
                  type="text"
                  value={studentData?.batch || ""}
                  readOnly
                  className="readonly"
                />
              </div>
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

export default StudentEditProfile; 