import React, { useState } from "react";
import axios from "axios";
import "../css/StudentForm.css";

function StudentForm() {
  const [form, setForm] = useState({
    name: "",
    roll_nu: "",
    enrollment_nu: "",
    branch: "",
    batch: "",
    date_of_birth: "",
    password: "",
    confirmpassword: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return "Name can only contain letters (A-Z) and spaces";
    }
    return "";
  };

  const validateRollNumber = (roll_nu) => {
    const rollRegex = /^\d+$/;
    if (!rollRegex.test(roll_nu)) {
      return "Roll number can only contain digits";
    }
    return "";
  };

  const validateEnrollmentNumber = (enrollment_nu) => {
    const enrollmentRegex = /^\d{14}$/;
    if (!enrollmentRegex.test(enrollment_nu)) {
      return "Enrollment number must be exactly 14 digits";
    }
    return "";
  };

  const validateBranch = (branch) => {
    const branchRegex = /^[A-Za-z]+$/;
    if (!branchRegex.test(branch)) {
      return "Branch can only contain letters";
    }
    return "";
  };

  const validateBatch = (batch) => {
    const batchRegex = /^[A-Za-z]\d+$/;
    if (!batchRegex.test(batch)) {
      return "Batch must start with a letter followed by digits";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmpassword) => {
    if (password !== confirmpassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleChange = e => {
    const { name, value } = e.target;
    
    // For roll number and enrollment number, only allow digits
    if (name === 'roll_nu' || name === 'enrollment_nu') {
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

    // Name validation
    const nameError = validateName(form.name);
    if (nameError) newErrors.name = nameError;

    // Roll number validation
    const rollError = validateRollNumber(form.roll_nu);
    if (rollError) newErrors.roll_nu = rollError;

    // Enrollment number validation
    const enrollmentError = validateEnrollmentNumber(form.enrollment_nu);
    if (enrollmentError) newErrors.enrollment_nu = enrollmentError;

    // Branch validation
    const branchError = validateBranch(form.branch);
    if (branchError) newErrors.branch = branchError;

    // Batch validation
    const batchError = validateBatch(form.batch);
    if (batchError) newErrors.batch = batchError;

    // Password validation
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    // Confirm password validation
    const confirmPasswordError = validateConfirmPassword(form.password, form.confirmpassword);
    if (confirmPasswordError) newErrors.confirmpassword = confirmPasswordError;

    // Required fields
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.roll_nu.trim()) newErrors.roll_nu = "Roll number is required";
    if (!form.enrollment_nu.trim()) newErrors.enrollment_nu = "Enrollment number is required";
    if (!form.branch.trim()) newErrors.branch = "Branch is required";
    if (!form.batch.trim()) newErrors.batch = "Batch is required";
    if (!form.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmpassword) newErrors.confirmpassword = "Please confirm your password";

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
      await axios.post("http://localhost:8000/api/students/", form);
      setMessage("Student data saved!");
      setForm({
        name: "",
        roll_nu: "",
        enrollment_nu: "",
        branch: "",
        batch: "",
        date_of_birth: "",
        password: "",
        confirmpassword: ""
      });
      setErrors({});
    } catch (err) {
      setMessage("Failed to save student data.");
    }
  };

  return (
    <div className="student-form-container">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Name (A-Z and spaces only)"
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input 
            name="roll_nu" 
            value={form.roll_nu} 
            onChange={handleChange} 
            placeholder="Roll Number (digits only)" 
            className={errors.roll_nu ? "error" : ""}
          />
          {errors.roll_nu && <span className="error-message">{errors.roll_nu}</span>}
        </div>

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
            name="branch" 
            value={form.branch} 
            onChange={handleChange} 
            placeholder="Branch (letters only)" 
            className={errors.branch ? "error" : ""}
          />
          {errors.branch && <span className="error-message">{errors.branch}</span>}
        </div>

        <div className="form-group">
          <input 
            name="batch" 
            value={form.batch} 
            onChange={handleChange} 
            placeholder="Batch (letter + digits)" 
            className={errors.batch ? "error" : ""}
          />
          {errors.batch && <span className="error-message">{errors.batch}</span>}
        </div>

        <div className="form-group">
          <input 
            name="date_of_birth" 
            type="date" 
            value={form.date_of_birth} 
            onChange={handleChange} 
            className={errors.date_of_birth ? "error" : ""}
          />
          {errors.date_of_birth && <span className="error-message">{errors.date_of_birth}</span>}
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

        <div className="form-group">
          <input 
            name="confirmpassword" 
            type="password" 
            value={form.confirmpassword} 
            onChange={handleChange} 
            placeholder="Confirm Password" 
            className={errors.confirmpassword ? "error" : ""}
          />
          {errors.confirmpassword && <span className="error-message">{errors.confirmpassword}</span>}
        </div>

        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default StudentForm;