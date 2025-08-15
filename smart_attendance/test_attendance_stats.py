import requests
import json

def test_attendance_stats():
    """Test the student attendance stats API endpoint"""
    
    # Test URL
    url = "http://localhost:8000/api/students/attendance/stats/"
    
    try:
        # Make GET request
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response Data: {json.dumps(data, indent=2)}")
            
            # Check if the response has the expected structure
            if 'students_stats' in data:
                print(f"✓ Success! Found {len(data['students_stats'])} students")
                for student in data['students_stats'][:3]:  # Show first 3 students
                    print(f"  - {student['name']} ({student['enrollment_nu']}): {student['attendance_percentage']}%")
            else:
                print("✗ Error: Response doesn't contain 'students_stats'")
                
        else:
            print(f"✗ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Error: Could not connect to the server. Make sure the Django server is running.")
    except Exception as e:
        print(f"✗ Error: {str(e)}")

if __name__ == "__main__":
    test_attendance_stats() 