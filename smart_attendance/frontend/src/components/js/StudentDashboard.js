import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/StudentDashboard.css";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function StudentDashboard() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get student data from localStorage
    const storedData = localStorage.getItem('studentData');
    if (!storedData) {
      navigate('/student-login');
      return;
    }

    const data = JSON.parse(storedData);
    setStudentData(data);
    fetchAttendanceHistory(data.enrollment_nu);
  }, [navigate]);

  const fetchAttendanceHistory = async (enrollmentNumber) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/students/attendance/history/?enrollment_nu=${enrollmentNumber}`);
      setAttendanceHistory(response.data.attendance_history || []);
    } catch (err) {
      console.error('Failed to fetch attendance history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentData');
    navigate('/student-login');
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

  if (loading) {
    return (
      <div className="student-dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Calculate present and absent counts
  const presentCount = attendanceHistory.filter(record => record.present === 1).length;
  const absentCount = attendanceHistory.filter(record => record.present === 0).length;

  // Calculate attendance percentage
  const percentage = attendanceHistory.length > 0
    ? Math.round((presentCount / attendanceHistory.length) * 100)
    : 0;

  // Prepare data for the chart
  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [presentCount, absentCount],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#388e3c', '#d32f2f'],
      },
    ],
  };

  // Custom plugin to display percentage in the center
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, width / 2, height / 2);
      ctx.restore();
    }
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="student-dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>Student Dashboard</h2>
          <div className="student-info">
            <p>Welcome, <strong style={{color: 'white'}}>{studentData?.name}</strong></p>
            <p>Enrollment: {studentData?.enrollment_nu}</p>
            <p>Branch: {studentData?.branch}</p>
            <p>Batch: {studentData?.batch}</p>
          </div>
        </div>
        
      </div>

      <div className="dashboard-content">
        <div className="attendance-summary">


          <h3>Attendance Summary</h3>
          <div className="summary-stats">
            <div className="stat-card">
              <span className="stat-number">{attendanceHistory.length}</span>
              <span className="stat-label">Total Records</span>
            </div>
            
            <div className="stat-card">
              <span className="stat-number">
                {presentCount}
              </span>
              <span className="stat-label">Present Days</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {absentCount}
              </span>
              <span className="stat-label">Absent Days</span>
            </div>
          </div>
        </div>

        <div className="attendance-history">
          <h3>Attendance History</h3>

          {attendanceHistory.length > 0 ? (
            <div className="history-table">
              <div className="history-header">
                <span>Date</span>
                <span>Status</span>
              </div>
              {attendanceHistory.map((record) => (
                <div key={record.id} className="history-row">
                  <span >{formatDate(record.date)}</span>
                  <div style={{backgroundColor:'white'}} className={`status ${record.present === 1 ? 'present' : 'absent'}`}>
                    {record.present === 1 ? 'Present' : 'Absent'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-records">No attendance records found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard; 