import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import "../css/StudentDashboard.css";

function StudentAttendanceChart() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const presentCount = attendanceHistory.filter(record => record.present === 1).length;
  const absentCount = attendanceHistory.filter(record => record.present === 0).length;
  const percentage = attendanceHistory.length > 0
    ? Math.round((presentCount / attendanceHistory.length) * 100)
    : 0;

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

  if (loading) {
    return (
      <div className="student-dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="student-dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>Attendance Chart</h2>
          <div className="student-info">
            <p>Welcome, <strong style={{color: 'white'}}>{studentData?.name}</strong></p>
            <p>Enrollment: {studentData?.enrollment_nu}</p>
            <p>Branch: {studentData?.branch}</p>
            <p>Batch: {studentData?.batch}</p>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="attendance-chart" style={{ maxWidth: 350, margin: '30px auto', height: 250 }}>
          <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
        </div>
      </div>
    </div>
  );
}

export default StudentAttendanceChart; 