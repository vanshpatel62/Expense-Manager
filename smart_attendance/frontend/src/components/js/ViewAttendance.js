import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ViewAttendance.css";

function ViewAttendance() {
  const navigate = useNavigate();
  const [studentsStats, setStudentsStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  // Get faculty data from localStorage
  const facultyData = JSON.parse(localStorage.getItem('facultyData') || '{}');

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8000/api/students/attendance/stats/");
      setStudentsStats(response.data.students_stats);
      setError("");
    } catch (err) {
      setError("Failed to fetch student attendance statistics");
      console.error('Error fetching student stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyData');
    navigate('/faculty-login');
  };

  const filteredStudents = studentsStats.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll_nu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.enrollment_nu.includes(searchTerm);
    const matchesBatch = !filterBatch || student.batch === filterBatch;
    return matchesSearch && matchesBatch;
  });

  const getUniqueBatches = () => {
    return [...new Set(studentsStats.map(student => student.batch))].sort();
  };

  const getAttendanceColor = (percentage) => {
    return percentage >= 70 ? 'light-green' : 'light-red';
  };

  const getAttendanceStatus = (percentage) => {
    return percentage >= 70 ? 'Good' : 'Poor';
  };

  return (
    <div className="view-attendance-container">
      <div className="attendance-header">
        <div className="header-content">
          <h2>Student Attendance Overview</h2>
          <p className="faculty-info">
            Welcome, <strong>{facultyData?.name}</strong> ({facultyData?.email})
          </p>
        </div>
        <button className="back-button" onClick={() => navigate('/faculty-attendance')}>
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name, roll number, or enrollment number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="batch-filter">
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="batch-select"
          >
            <option value="">All Batches</option>
            {getUniqueBatches().map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading student attendance statistics...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="stats-summary">
          <div className="summary-card">
            <h3>Overall Statistics</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Students:</span>
                <span className="stat-value">{studentsStats.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Good Attendance (≥70%):</span>
                <span className="stat-value good">
                  {studentsStats.filter(s => s.attendance_percentage >= 70).length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Poor Attendance (&lt;70%):</span>
                <span className="stat-value poor">
                  {studentsStats.filter(s => s.attendance_percentage < 70).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="students-table-container">
          <h3>Student Attendance Details</h3>
          <div className="students-table">
            <div className="table-header">
              <div className="header-cell">Student Name</div>
              <div className="header-cell">Roll No</div>
              <div className="header-cell">Batch</div>
              <div className="header-cell">Branch</div>
              <div className="header-cell">Total Lectures</div>
              <div className="header-cell">Present</div>
              <div className="header-cell">Absent</div>
              <div className="header-cell">Attendance %</div>
              <div className="header-cell">Status</div>
            </div>
            
            {filteredStudents.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-search"></i>
                <p>No students found matching your search criteria.</p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div 
                  key={student.student_id} 
                  className={`table-row ${getAttendanceColor(student.attendance_percentage)}`}
                >
                  <div className="table-cell">{student.name}</div>
                  <div className="table-cell roll">{student.roll_nu}</div>
                  <div className="table-cell batch">{student.batch}</div>
                  <div className="table-cell branch">{student.branch}</div>
                  <div className="table-cell">{student.total_lectures}</div>
                  <div className="table-cell present">{student.present_lectures}</div>
                  <div className="table-cell absent">{student.absent_lectures}</div>
                  <div className="table-cell percentage">
                    {student.attendance_percentage}%
                  </div>
                  <div className={`table-cell status ${getAttendanceColor(student.attendance_percentage)}`}>
                    {getAttendanceStatus(student.attendance_percentage)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default ViewAttendance; 