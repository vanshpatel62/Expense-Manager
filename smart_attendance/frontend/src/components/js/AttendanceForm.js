import React, { useState } from "react";

function AttendanceForm() {
  const [form, setForm] = useState({ name: "", date: "", present: false });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:8000/api/student-attendance/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setMessage("Attendance submitted!");
        setForm({ name: "", date: "", present: false });
      } else {
        setMessage("Error submitting attendance.");
      }
    } catch (err) {
      setMessage("Network error.");
    }
  };

  return (
    <div>
      <h2>Attendance Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <label>
          Present:
          <input
            name="present"
            type="checkbox"
            checked={form.present}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AttendanceForm;