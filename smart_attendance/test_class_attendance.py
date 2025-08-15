import requests
import json

# Test Class Attendance API endpoints
BASE_URL = "http://localhost:8000/api"

def test_class_attendance():
    print("Testing Class Attendance functionality...")
    
    # Test 1: Get batches
    print("\n1. Testing /batches/ endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/batches/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            batches = data.get('batches', [])
            print(f"Batches found: {batches}")
            
            if batches:
                # Test 2: Get students by batch
                batch = batches[0]
                print(f"\n2. Testing /students/by-batch/ endpoint with batch: {batch}")
                response2 = requests.get(f"{BASE_URL}/students/by-batch/?batch={batch}")
                print(f"Status: {response2.status_code}")
                if response2.status_code == 200:
                    data2 = response2.json()
                    students = data2.get('students', [])
                    print(f"Students found: {len(students)}")
                    for student in students:
                        print(f"  - {student['name']} ({student['enrollment_nu']}) - {student['batch']}")
                else:
                    print(f"Error: {response2.text}")
            else:
                print("No batches available to test students endpoint")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Test class attendance submission
    print("\n3. Testing class attendance submission...")
    try:
        # First get a batch and students
        response = requests.get(f"{BASE_URL}/batches/")
        if response.status_code == 200:
            data = response.json()
            batches = data.get('batches', [])
            
            if batches:
                batch = batches[0]
                response2 = requests.get(f"{BASE_URL}/students/by-batch/?batch={batch}")
                
                if response2.status_code == 200:
                    data2 = response2.json()
                    students = data2.get('students', [])
                    
                    if students:
                        # Create attendance data
                        attendance_data = []
                        for student in students:
                            attendance_data.append({
                                'student_name': student['name'],
                                'enrollment_no': student['enrollment_nu'],
                                'batch': student['batch'],
                                'branch': student['branch'],
                                'roll_no': student['roll_nu'],
                                'present': 1  # Mark all as present for testing
                            })
                        
                        # Submit attendance
                        submission_data = {
                            'attendance_data': attendance_data,
                            'faculty_name': 'Test Faculty',
                            'date': '2024-01-15'
                        }
                        
                        response3 = requests.post(f"{BASE_URL}/class-attendance/", json=submission_data)
                        print(f"Submission Status: {response3.status_code}")
                        if response3.status_code == 201:
                            print("Class attendance submitted successfully!")
                        else:
                            print(f"Error: {response3.text}")
                    else:
                        print("No students found to test attendance submission")
                else:
                    print("Could not get students to test attendance submission")
            else:
                print("No batches available to test attendance submission")
        else:
            print("Could not get batches to test attendance submission")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_class_attendance() 