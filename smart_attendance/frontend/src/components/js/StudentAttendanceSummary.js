import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

function getWeekOfMonth(dateStr) {
  const date = new Date(dateStr);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7) - 1; // 0-based
}

function getLastNDaysLabels(n) {
  const arr = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return arr;
}

function StudentAttendanceSummary() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [period, setPeriod] = useState('weekly');
  const [attendanceData, setAttendanceData] = useState([]); // Raw attendance records
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all batches on mount
  useEffect(() => {
    axios.get('http://localhost:8000/api/batches/')
      .then(res => {
        setBatches(res.data.batches || []);
        if (res.data.batches && res.data.batches.length > 0) {
          setSelectedBatch(res.data.batches[0]);
        }
      });
  }, []);

  // Fetch all students in the selected batch and their attendance
  useEffect(() => {
    if (!selectedBatch) return;
    setLoading(true);
    axios.get(`http://localhost:8000/api/students/by-batch/?batch=${selectedBatch}`)
      .then(async res => {
        const students = res.data.students || [];
        // Fetch attendance for all students in batch
        const allAttendance = [];
        for (const student of students) {
          const resp = await axios.get(`http://localhost:8000/api/students/attendance/history/?enrollment_nu=${student.enrollment_nu}`);
          (resp.data.attendance_history || []).forEach(record => {
            allAttendance.push({ ...record, enrollment_nu: student.enrollment_nu });
          });
        }
        setAttendanceData(allAttendance);
      })
      .finally(() => setLoading(false));
  }, [selectedBatch]);

  // Aggregate attendance by week or day
  function getSummaryData() {
    if (!attendanceData.length) return { labels: [], data: [] };
    if (period === 'weekly') {
      // Group by week (across all months)
      const weekStats = Array(5).fill(null).map(() => ({ present: 0, total: 0 }));
      attendanceData.forEach(record => {
        const w = getWeekOfMonth(record.date);
        if (w >= 0 && w < 5) {
          weekStats[w].total++;
          if (record.present === 1) weekStats[w].present++;
        }
      });
      const labels = weeks.filter((_, i) => weekStats[i].total > 0);
      const data = weekStats.filter(w => w.total > 0).map(w => w.total ? Math.round((w.present / w.total) * 100) : 0);
      return { labels, data };
    } else {
      // Day-wise: last 30 days
      const days = getLastNDaysLabels(30);
      const dayStats = days.map(date => ({ date, present: 0, total: 0 }));
      attendanceData.forEach(record => {
        const idx = days.indexOf(record.date);
        if (idx !== -1) {
          dayStats[idx].total++;
          if (record.present === 1) dayStats[idx].present++;
        }
      });
      const labels = dayStats.map(d => d.date.slice(5)); // MM-DD
      const data = dayStats.map(d => d.total ? Math.round((d.present / d.total) * 100) : null);
      return { labels, data };
    }
  }

  const summary = getSummaryData();

  const chartData = {
    labels: summary.labels || [],
    datasets: [
      {
        label: `Attendance % (${selectedBatch})`,
        data: summary.data || [],
        fill: false,
        borderColor: '#4caf50',
        backgroundColor: '#4caf50',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: `Attendance Summary (${period === 'weekly' ? 'Weekly' : 'Day-wise'})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Attendance %',
        },
      },
      x: {
        title: {
          display: true,
          text: period === 'weekly' ? 'Week' : 'Day',
        },
      },
    },
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <button
        onClick={() => navigate('/faculty-attendance')}
        style={{
          marginBottom: 24,
          background: '#f5f5f5',
          border: 'none',
          borderRadius: 8,
          padding: '8px 18px',
          fontWeight: 500,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0001',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <i className="fas fa-arrow-left"></i> Back to Faculty Profile
      </button>
      <h2 style={{ marginBottom: 28 }}>Attendance Summary</h2>
      <div style={{ marginBottom: 28, display: 'flex', gap: 32, alignItems: 'center' }}>
        <label style={{ fontWeight: 500, fontSize: 16 }}>
          Batch:
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} style={{ marginLeft: 12, padding: '7px 16px', borderRadius: 6, border: '1px solid #bbb', fontSize: 15, fontWeight: 500 }}>
            {batches.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </label>
        <label style={{ fontWeight: 500, fontSize: 16 }}>
          Period:
          <select value={period} onChange={e => setPeriod(e.target.value)} style={{ marginLeft: 12, padding: '7px 16px', borderRadius: 6, border: '1px solid #bbb', fontSize: 15, fontWeight: 500 }}>
            <option value="weekly">Weekly</option>
            <option value="daily">Day-wise</option>
          </select>
        </label>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px #0001', minHeight: 400 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading attendance data...</div>
        ) : (
          <Line data={chartData} options={options} height={350} />
        )}
      </div>
    </div>
  );
}

export default StudentAttendanceSummary; 