# Testing Instructions for Smart Attendance System

## Prerequisites
1. Make sure Django backend is running on `http://localhost:8000`
2. Make sure React frontend is running on `http://localhost:3000`

## Setup Sample Data

### 1. Migrate Existing Data (if any)
If you have existing ClassAttendance data, migrate it first:
```bash
cd backend
python migrate_class_attendance_data.py
```

### 2. Apply Database Migration
```bash
cd backend
python manage.py migrate
```

**Note**: This will apply two migrations:
1. Add `faculty_name` field to StudentAttendance and remove ClassAttendance table
2. Update the `date` field to allow manual date input instead of auto-using today's date

### 3. Add Sample Students and Attendance Data
```bash
cd backend
python manage.py add_sample_data
```

### 4. Add Sample Faculty Data
```bash
cd backend
python manage.py add_sample_faculty
```

## Test the System

### 1. Faculty Login
- Go to `http://localhost:3000/faculty-login`
- Use one of these credentials:
  - Email: `robert.johnson@university.edu`, Password: `Faculty@123`
  - Email: `mary.williams@university.edu`, Password: `Faculty@123`

### 2. Test View Students Functionality
After logging in as faculty:
1. Click "View Students" button
2. Select a batch from the dropdown (CS2023 or EE2023)
3. You should see the list of students in that batch

### 3. Test View Attendance Functionality
After logging in as faculty:
1. Click "View Attendance" button
2. You should see a table with all students and their attendance statistics
3. Students with ≥70% attendance will be highlighted in light green
4. Students with <70% attendance will be highlighted in light red

### 4. Test Class Attendance Functionality
After logging in as faculty:
1. Click "Class Attendance" button
2. Select a batch from the dropdown (CS2023 or EE2023)
3. You should see the list of students in that batch
4. Mark attendance for each student (Present/Absent)
5. Click "Submit Class Attendance"
6. You should see a success message

### 5. Test API Endpoints Directly
Run the test scripts:
```bash
# Test general API endpoints
python test_api.py

# Test class attendance specifically
python test_class_attendance.py
```

This will test:
- `/api/batches/` - Get all batches
- `/api/students/by-batch/?batch=CS2023` - Get students by batch
- `/api/students/attendance/stats/` - Get student attendance statistics
- `/api/class-attendance/` - Submit class attendance

## Expected Results

### View Students
- Should show 3 students in CS2023 batch
- Should show 2 students in EE2023 batch
- No 404 errors should occur

### View Attendance
- Should show attendance statistics for all 5 students
- Each student should have:
  - Total lectures (should be around 10)
  - Present lectures
  - Absent lectures
  - Attendance percentage
  - Color coding (green for ≥70%, red for <70%)

### Class Attendance
- Should show 3 students in CS2023 batch
- Should show 2 students in EE2023 batch
- Should allow marking attendance for each student
- Should successfully submit attendance data
- All attendance data is now stored in StudentAttendance table with faculty information
- **Date Selection**: You can now select any date and it will be stored correctly (not just today's date)

## Troubleshooting

### If you get 404 errors:
1. Make sure Django server is running
2. Check that the URL patterns are correct in `backend/attendance/urls.py`
3. Verify that the frontend is calling the correct API endpoints

### If no students are found:
1. Run the sample data commands
2. Check the database to ensure data was created
3. Verify the batch names match exactly

### If attendance statistics are empty:
1. Make sure attendance records were created
2. Check that the enrollment number fields match between StudentData and StudentAttendance models

### If class attendance shows "No students found":
1. Make sure sample data was created with `python manage.py add_sample_data`
2. Check the browser console for any error messages
3. Verify that the batch names match exactly (CS2023, EE2023)
4. Check the Django server console for debug messages

### If attendance is always stored with today's date:
1. Make sure you've run the migrations: `python manage.py migrate`
2. The migration should update the `date` field to allow manual input
3. Check that the selected date in the form is being passed correctly

## Sample Data Created

### Students:
- John Doe (CS2023)
- Jane Smith (CS2023)
- Mike Johnson (CS2023)
- Sarah Wilson (EE2023)
- David Brown (EE2023)

### Faculty:
- Dr. Robert Johnson
- Prof. Mary Williams

### Attendance Records:
- 10 days of attendance records for each student
- Random present/absent status with 70% present rate
- All attendance data stored in StudentAttendance table
- Faculty information included in attendance records 