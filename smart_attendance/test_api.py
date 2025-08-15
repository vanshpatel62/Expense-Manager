import requests
import json

# Test API endpoints
BASE_URL = "http://localhost:8000/api"

def test_endpoints():
    print("Testing API endpoints...")
    
    # Test 1: Get batches
    print("\n1. Testing /batches/ endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/batches/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Batches found: {data.get('batches', [])}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Get students by batch (if batches exist)
    print("\n2. Testing /students/by-batch/ endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/batches/")
        if response.status_code == 200:
            data = response.json()
            batches = data.get('batches', [])
            if batches:
                batch = batches[0]
                print(f"Testing with batch: {batch}")
                response2 = requests.get(f"{BASE_URL}/students/by-batch/?batch={batch}")
                print(f"Status: {response2.status_code}")
                if response2.status_code == 200:
                    data2 = response2.json()
                    print(f"Students found: {data2.get('total_students', 0)}")
                else:
                    print(f"Error: {response2.text}")
            else:
                print("No batches available to test")
        else:
            print("Could not get batches to test students endpoint")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Get student attendance stats
    print("\n3. Testing /students/attendance/stats/ endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/students/attendance/stats/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Students stats found: {data.get('total_students', 0)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_endpoints() 