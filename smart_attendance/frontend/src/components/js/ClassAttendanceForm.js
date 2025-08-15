import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ClassAttendanceForm.css";

function ClassAttendanceForm() {
  const navigate = useNavigate();
  // Get faculty data from localStorage
  const facultyData = JSON.parse(localStorage.getItem('facultyData') || '{}');
  
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Check if faculty is logged in
  useEffect(() => {
    if (!facultyData || !facultyData.email) {
      navigate('/faculty-login');
      return;
    }
    
    // Fetch all batches when component mounts
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setMessage("");
      
      const response = await axios.get("http://localhost:8000/api/batches/", {
        timeout: 10000
      });
      
      if (response.data && response.data.batches) {
        setBatches(response.data.batches);
        setMessage("");
      } else {
        setMessage("No batches found.");
      }
    } catch (err) {
      console.error('Failed to fetch batches:', err);
      setMessage("Failed to load batches. Please try again.");
      setBatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentsByBatch = async (batch) => {
    if (!batch) {
      setStudents([]);
      setAttendanceData([]);
      return;
    }

    if (isLoadingStudents) return;

    try {
      setIsLoadingStudents(true);
      setMessage("");
      
      console.log(`Fetching students for batch: ${batch}`);
      const response = await axios.get(`http://localhost:8000/api/students/by-batch/?batch=${encodeURIComponent(batch)}`, {
        timeout: 10000
      });
      
      console.log('Response:', response.data);
      
      if (response.data && response.data.students) {
        const studentList = response.data.students;
        console.log(`Found ${studentList.length} students:`, studentList);
        setStudents(studentList);
        
        // Initialize attendance data with all students marked as present by default
        const initialAttendance = studentList.map(student => ({
          student_name: student.name,
          enrollment_no: student.enrollment_nu,
          batch: student.batch,
          branch: student.branch,
          present: 1 // Default to present
        }));
        setAttendanceData(initialAttendance);
      } else {
        console.log('No students data in response:', response.data);
        setMessage("No students found in this batch.");
        setStudents([]);
        setAttendanceData([]);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setMessage(`Server error: ${err.response.status}. ${err.response.data.error || 'Please try again.'}`);
      } else if (err.request) {
        setMessage("Network error. Please check your connection and try again.");
      } else {
        setMessage("Failed to load students for this batch. Please try again.");
      }
      setStudents([]);
      setAttendanceData([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleBatchChange = (e) => {
    const batch = e.target.value;
    setSelectedBatch(batch);
    
    if (batch) {
      fetchStudentsByBatch(batch);
    } else {
      setStudents([]);
      setAttendanceData([]);
    }
  };

  const handleAttendanceChange = (enrollmentNo, present) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.enrollment_no === enrollmentNo 
          ? { ...student, present: present ? 1 : 0 }
          : student
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBatch || attendanceData.length === 0) {
      setMessage("Please select a batch and ensure students are loaded.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      
      const response = await axios.post("http://localhost:8000/api/class-attendance/", {
        attendance_data: attendanceData,
        faculty_name: facultyData.name,
        date: selectedDate
      }, {
        timeout: 15000
      });
      
      setMessage(response.data.message);
      
      // Clear form after successful submission
      setTimeout(() => {
        setSelectedBatch("");
        setStudents([]);
        setAttendanceData([]);
        setMessage("");
      }, 3000);
      
    } catch (err) {
      console.error('Failed to submit attendance:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Failed to submit attendance. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyData');
    navigate('/faculty-login');
  };

  const handleBackToAttendance = () => {
    navigate('/faculty-attendance');
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

  const presentCount = attendanceData.filter(student => student.present === 1).length;
  const absentCount = attendanceData.filter(student => student.present === 0).length;

  return (
    <div className="class-attendance-container">
      <div className="attendance-header">
        <div className="header-content">
          <h2>Class Attendance</h2>
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

      <form onSubmit={handleSubmit} className="attendance-form">
        <div className="form-section">
          <h3>Select Batch and Date</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="batch-select">Select Batch:</label>
              <select
                id="batch-select"
                value={selectedBatch}
                onChange={handleBatchChange}
                className="batch-dropdown"
                disabled={isLoading}
                required
              >
                <option value="">-- Select a Batch --</option>
                {batches.map((batch, index) => (
                  <option key={index} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date-select">Date:</label>
              <div className="date-selection">
                <button
                  type="button"
                  className="date-button today"
                  onClick={() => setSelectedDate(getCurrentDate())}
                >
                  Today
                </button>
                <input
                  type="date"
                  id="date-select"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              <p className="selected-date">Selected: {formatDate(selectedDate)}</p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message}
          </div>
        )}

        {selectedBatch && students.length > 0 && (
          <div className="students-section">
            <div className="section-header">
              <h3>Mark Attendance for Batch: {selectedBatch}</h3>
              <div className="attendance-summary">
                <span className="summary-item present">
                  <i className="fas fa-check"></i>
                  Present: {presentCount}
                </span>
                <span className="summary-item absent">
                  <i className="fas fa-times"></i>
                  Absent: {absentCount}
                </span>
                <span className="summary-item total">
                  <i className="fas fa-users"></i>
                  Total: {students.length}
                </span>
              </div>
            </div>

            {isLoadingStudents ? (
              <div className="loading-container">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading students...</p>
              </div>
            ) : (
              <div className="students-table">
                <div className="table-header">
                  <span className="col-name" style={{ marginLeft: '90px' }}>Student Name</span>
                  
                  <span className="col-enrollment head" style={{ marginLeft: '60px' }}>Enrollment</span>
                 

                  <span className="col-branch head" style={{marginLeft:"120px"}}>Branch</span>
                 

                  <span className="col-roll" style={{ marginLeft: '200px' }}>Roll No</span>
                 

                  <span className="col-attendance" style={{ marginLeft: '160px' }}>Attendance</span>
                  
                </div>
                {students.map((student, index) => (
                  <div key={student.id} className="student-row">
                    <span className="col-name">{student.name}</span>
                    
                    <span className="col-enrollment" style={{ marginLeft: '10px' }}>{student.enrollment_nu}</span>
                    <span className="col-branch" style={{ marginLeft: '10px' }}>{student.branch}</span>
                    <span className="col-roll" style={{ marginLeft: '10px' }}>{student.roll_nu}</span>
                    <span className="col-attendance" style={{ marginLeft: '10px'}}>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name={`attendance-${student.enrollment_nu}`}
                            value="1"
                            checked={attendanceData.find(s => s.enrollment_no === student.enrollment_nu)?.present === 1}
                            onChange={() => handleAttendanceChange(student.enrollment_nu, true)}
                          />
                          <span className="radio-text present">Present</span>
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name={`attendance-${student.enrollment_nu}`}
                            value="0"
                            checked={attendanceData.find(s => s.enrollment_no === student.enrollment_nu)?.present === 0}
                            onChange={() => handleAttendanceChange(student.enrollment_nu, false)}
                          />
                          <span className="radio-text absent">Absent</span>
                        </label>
                      </div>
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="submit-section">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting || students.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Submitting Attendance...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Submit Class Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {selectedBatch && students.length === 0 && !isLoadingStudents && (
          <div className="no-students">
            <i className="fas fa-users-slash"></i>
            <p>No students found in this batch.</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default ClassAttendanceForm; 