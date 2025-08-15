import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/FacultyStudentView.css";

function FacultyStudentView() {
  const navigate = useNavigate();
  // Get faculty data from localStorage
  const facultyData = JSON.parse(localStorage.getItem('facultyData') || '{}');
  
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [message, setMessage] = useState("");
  const [fetchTimeout, setFetchTimeout] = useState(null);

  // Check if faculty is logged in
  useEffect(() => {
    if (!facultyData || !facultyData.email) {
      navigate('/faculty-login');
      return;
    }
    
    // Fetch all batches when component mounts only once
    fetchBatches();
    
    // Cleanup function to clear timeouts
    return () => {
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }
    };
  }, []); // Remove dependencies to prevent re-rendering

  // Add a retry function
  const handleRetry = () => {
    // Reset backend health check to allow retry
    setBackendHealthChecked(false);
    setIsBackendHealthy(true);
    fetchBatches();
  };

  // Check if backend is accessible - with caching to prevent repeated calls
  const [backendHealthChecked, setBackendHealthChecked] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  
  const checkBackendHealth = async () => {
    // Only check once per session
    if (backendHealthChecked) {
      return isBackendHealthy;
    }
    
    // Add a small delay to prevent rapid calls
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Try to access the batches endpoint directly instead of generic API
      await axios.get("http://localhost:8000/api/batches/", { timeout: 5000 });
      setIsBackendHealthy(true);
      setBackendHealthChecked(true);
      return true;
    } catch (err) {
      // If batches endpoint fails, try the students endpoint
      try {
        await axios.get("http://localhost:8000/api/students/", { timeout: 3000 });
        setIsBackendHealthy(true);
        setBackendHealthChecked(true);
        return true;
      } catch (err2) {
        setIsBackendHealthy(false);
        setBackendHealthChecked(true);
        return false;
      }
    }
  };

  const fetchBatches = async () => {
    // Prevent multiple simultaneous requests
    if (isLoading) {
      return;
    }
    
    try {
      setIsLoading(true);
      setMessage("");
      
      // Try to fetch batches directly without health check first
      const response = await axios.get("http://localhost:8000/api/batches/", {
        timeout: 10000 // 10 seconds timeout
      });
      
      if (response.data && response.data.batches) {
        setBatches(response.data.batches);
        setMessage(""); // Clear any previous messages
        setIsBackendHealthy(true);
        setBackendHealthChecked(true);
      } else {
        setMessage("No batches found.");
      }
    } catch (err) {
      console.error('Failed to fetch batches:', err);
      
      // If direct fetch fails, try health check
      const isBackendHealthy = await checkBackendHealth();
      if (!isBackendHealthy) {
        setMessage("Backend server is not accessible. Please ensure the server is running.");
        setBatches([]);
        return;
      }
      
      // If health check passes but fetch failed, show specific error
      if (err.code === 'ECONNABORTED') {
        setMessage("Request timeout. Please check your connection and try again.");
      } else if (err.response) {
        setMessage(`Server error: ${err.response.status}. Please try again.`);
      } else if (err.request) {
        setMessage("Network error. Please check your connection and try again.");
      } else {
        setMessage("Failed to load batches. Please try again.");
      }
      setBatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentsByBatch = async (batch) => {
    if (!batch) {
      setStudents([]);
      return;
    }

    // Prevent multiple simultaneous requests
    if (isLoadingStudents) {
      return;
    }

    try {
      setIsLoadingStudents(true);
      setMessage("");
      
      // Add timeout to the request
      const response = await axios.get(`http://localhost:8000/api/students/by-batch/?batch=${encodeURIComponent(batch)}`, {
        timeout: 10000 // 10 seconds timeout
      });
      
      if (response.data && response.data.students) {
        setStudents(response.data.students);
      } else {
        setMessage("No students found in this batch.");
        setStudents([]);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
      if (err.code === 'ECONNABORTED') {
        setMessage("Request timeout. Please check your connection and try again.");
      } else if (err.response) {
        setMessage(`Server error: ${err.response.status}. Please try again.`);
      } else if (err.request) {
        setMessage("Network error. Please check your connection and try again.");
      } else {
        setMessage("Failed to load students for this batch. Please try again.");
      }
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const   handleBatchChange = (e) => {
    const batch = e.target.value;
    setSelectedBatch(batch);
    
    // Clear any existing timeout
    if (fetchTimeout) {
      clearTimeout(fetchTimeout);
    }
    
    // Add a delay to prevent rapid API calls
    if (batch) {
      const timeout = setTimeout(() => {
        fetchStudentsByBatch(batch);
      }, 300); // Increased delay to 300ms
      setFetchTimeout(timeout);
    } else {
      setStudents([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyData');
    navigate('/faculty-login');
  };

  const handleBackToAttendance = () => {
    navigate('/faculty-attendance');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="faculty-student-container">
      <div className="student-header">
        <div className="header-content">
          <h2>Student Management</h2>
          <p className="faculty-info">
            Welcome, <strong>{facultyData?.name}</strong> ({facultyData?.email})
          </p>
        </div>
        <div className="header-buttons">
          <button className="back-button" onClick={handleBackToAttendance}>
            <i className="fas fa-arrow-left"></i>
            Back 
          </button>
        </div>
      </div>

      <div className="batch-selection">
        <div className="selection-header">
          <h3>Select Batch to View Students</h3>
          <p>Choose a batch from the dropdown to view all students in that batch</p>
          <div className="connection-status">
            <span className={`status-indicator ${isBackendHealthy ? 'connected' : 'disconnected'}`}>
              <i className={`fas ${isBackendHealthy ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              {isBackendHealthy ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="batch-dropdown-container">
          <div className="dropdown-header">
            <label htmlFor="batch-select">
              Select Batch:
              {isLoading && <i className="fas fa-spinner fa-spin loading-icon"></i>}
            </label>
            <button 
              className="refresh-button" 
              onClick={handleRetry}
              disabled={isLoading}
              title="Refresh batches"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
          <select
            id="batch-select"
            value={selectedBatch}
            onChange={handleBatchChange}
            className="batch-dropdown"
            disabled={isLoading}
          >
            <option value="">
              {isLoading ? "Loading batches..." : batches.length === 0 ? "No batches available" : "-- Select a Batch --"}
            </option>
            {batches.map((batch, index) => (
              <option key={index} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <div className={`message ${message.includes('Failed') || message.includes('not accessible') ? 'error' : 'success'}`}>
            <i className={`fas ${message.includes('Failed') || message.includes('not accessible') ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
            {message}
            {(message.includes('Failed') || message.includes('not accessible')) && (
              <button className="retry-button" onClick={handleRetry}>
                <i className="fas fa-redo"></i>
                Retry
              </button>
            )}
          </div>
        )}
      </div>

      {selectedBatch && (
        <div className="students-section">
          <div className="section-header">
            <h3>Students in Batch: {selectedBatch}</h3>
            <span className="student-count">
              {students.length} student{students.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoadingStudents ? (
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading students...</p>
            </div>
          ) : students.length > 0 ? (
            <div className="students-table">
              <div className="table-header">
                <span className="col-name" style={{marginLeft:"120px"}}>Name</span>
                {/* <span className="col-space"></span> */}

                <span className="col-roll "   style={{marginLeft:"60px"}}>Roll Number</span>
                {/* <span className="col-space"></span> */}

                <span className="col-enrollment" style={{marginLeft:"170px"}}>Enrollment Number</span>
                {/* <span className="col-space"></span> */}

                <span className="cobranchl-" style={{marginLeft:"250px"}}>Branch</span>
              
              </div>
              {students.map((student) => (
                <div key={student.id} className="student-row">
                  <span className="col-name names">{student.name}</span>
                  <span className="col-roll rolls"  style={{marginLeft:"-80px"}}>{student.roll_nu}</span>
                  <span className="col-enrollment">{student.enrollment_nu}</span>
                  <span className="col-branch"  style={{marginLeft:"200px"}}>{student.branch}</span>
                
                </div>
              ))}
            </div>
          ) : (
            <div className="no-students">
              <i className="fas fa-users-slash"></i>
              <p>No students found in this batch.</p>
            </div>
          )}
        </div>
      )}

      {!selectedBatch && batches.length > 0 && (
        <div className="batch-info">
          <div className="info-card">
            <i className="fas fa-info-circle"></i>
            <h4>Available Batches</h4>
            <p>Total batches available: <strong>{batches.length}</strong></p>
            <p>Select a batch from the dropdown above to view the students.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyStudentView; 