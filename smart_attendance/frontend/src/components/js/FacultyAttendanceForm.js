import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/FacultyAttendanceForm.css";

function FacultyAttendanceForm() {
  const navigate = useNavigate();
  // Get faculty data from localStorage
  const facultyData = JSON.parse(localStorage.getItem('facultyData') || '{}');
  
  const [form, setForm] = useState({
    faculty_name: facultyData?.name || "",
    email: facultyData?.email || "",
    phone_no: facultyData?.phone || "",
    present: 0,
    date: new Date().toISOString().split('T')[0] // Today's date as default
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePresentClick = () => {
    setForm(prev => ({ ...prev, present: 1 }));
  };

  const handleAbsentClick = () => {
    setForm(prev => ({ ...prev, present: 0 }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/faculty/attendance/", form);
      setMessage(response.data.message);
      
      // Clear form after successful submission
      setForm(prev => ({
        ...prev,
        present: 0
      }));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Failed to mark attendance. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fetchAttendanceHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/faculty/attendance/history/?email=${facultyData.email}`);
      setAttendanceHistory(response.data.attendance_history);
      setShowHistory(!showHistory);
    } catch (err) {
      console.error('Failed to fetch attendance history:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyData');
    navigate('/faculty-login');
  };

  return (
    <div className="faculty-attendance-container">
      <div className="attendance-header">
        <div className="header-content">
          <h2>Faculty Attendance</h2>
          <p className="faculty-info">
            Welcome, <strong>{facultyData?.name}</strong> ({facultyData?.email})
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="attendance-form">
        <div className="form-group">
          <label>Faculty Name:</label>
          <input
            type="text"
            name="faculty_name"
            value={form.faculty_name}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_no"
            value={form.phone_no}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <div className="date-selection">
            <button
              type="button"
              className="date-button today"
              onClick={() => setForm(prev => ({ ...prev, date: getCurrentDate() }))}
            >
              Today
            </button>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <p className="selected-date">Selected: {formatDate(form.date)}</p>
        </div>

        <div className="form-group">
          <label>Attendance Status:</label>
          <div className="status-buttons">
            <button
              type="button"
              className={`status-button present ${form.present === 1 ? 'active' : ''}`}
              onClick={handlePresentClick}
            >
              <i className="fas fa-check"></i>
              I am Present
            </button>
            <button
              type="button"
              className={`status-button absent ${form.present === 0 ? 'active' : ''}`}
              onClick={handleAbsentClick}
            >
              <i className="fas fa-times"></i>
              I am Absent
            </button>
          </div>
        </div>

        <div className="form-group">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Marking Attendance...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Mark Attendance
              </>
            )}
          </button>
        </div>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {message}
        </div>
      )}

      <div className="attendance-summary">
        <div className="summary-header">
          <h3>Today's Summary</h3>
          <button 
            type="button" 
            className="history-button"
            onClick={fetchAttendanceHistory}
          >
            <i className="fas fa-history"></i>
            {showHistory ? 'Hide History' : 'View History'}
          </button>
        </div>
        <div className="summary-card">
          <div className="summary-item">
            <span className="label">Date:</span>
            <span className="value">{formatDate(getCurrentDate())}</span>
          </div>
          <div className="summary-item">
            <span className="label">Status:</span>
            <span className={`value status ${form.present === 1 ? 'present' : 'absent'}`}>
              {form.present === 1 ? 'Present' : 'Absent'}
            </span>
          </div>
        </div>
      </div>

      {showHistory && attendanceHistory.length > 0 && (
        <div className="attendance-history">
          <h3>Attendance History</h3>
          <div className="history-table">
            <div className="history-header">
              <span>Date</span>
              <span>Status</span>
            </div>
            {attendanceHistory.map((record, index) => (
              <div key={record.id} className="history-row">
                <span>{formatDate(record.date)}</span>
                <span className={`status ${record.present === 1 ? 'present' : 'absent'}`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyAttendanceForm; 