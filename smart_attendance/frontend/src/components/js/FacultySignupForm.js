import React, { useState } from "react";
import axios from "axios";
import "../css/FacultySignupForm.css";



function FacultySignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",    
    phone: "",
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Phone number must be exactly 10 digits";
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

  const validateconfirmpassword = (password, confirmpassword) => {
    if (password !== confirmpassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits
    if (name === 'phone') {
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

    // Email validation
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    // Phone validation
    const phoneError = validatePhone(form.phone);
    if (phoneError) newErrors.phone = phoneError;

    // Password validation
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    // Confirm password validation
    const confirmpasswordError = validateconfirmpassword(form.password, form.confirmpassword);
    if (confirmpasswordError) newErrors.confirmpassword = confirmpasswordError;

    // Required fields
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmpassword) newErrors.confirmpassword = "Please confirm your password";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      setMessage("Please fix the errors above");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/faculty/signup/", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmpassword:form.confirmpassword,
      });

      setMessage("Faculty registered successfully!");
              setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmpassword: ""
        });
      setErrors({});
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Failed to register faculty. Please try again.");
      }
    }
  };

  return (
    <div className="faculty-signup-container">
      <h2>Faculty Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name (A-Z and spaces only)"
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

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
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number (10 digits only)"
            maxLength="10"
            className={errors.phone ? "error" : ""}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
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
          <div className="password-requirements">
            <small>Password must contain:</small>
            <ul>
              <li className={form.password.length >= 8 ? "valid" : "invalid"}>At least 8 characters</li>
              <li className={/(?=.*[a-z])/.test(form.password) ? "valid" : "invalid"}>One lowercase letter</li>
              <li className={/(?=.*[A-Z])/.test(form.password) ? "valid" : "invalid"}>One uppercase letter</li>
              <li className={/(?=.*\d)/.test(form.password) ? "valid" : "invalid"}>One number</li>
              <li className={/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(form.password) ? "valid" : "invalid"}>One special character</li>
            </ul>
          </div>
        </div>

        <div className="form-group">
          <input
            name="confirmpassword"
            type="password"
            value={form.confirmpassword}
            onChange={handleChange}
            placeholder="Conform Password"
            className={errors.confirmpassword ? "error" : ""}
          />
          {errors.confirmpassword && <span className="error-message">{errors.confirmpassword}</span>}
        </div>

        <button type="submit">Register Faculty</button>
      </form>
      {message && <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>}
    </div>
  );
}

export default FacultySignupForm;
