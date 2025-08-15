#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_manager.settings')
django.setup()

from expenses.models import User, UserProfile
from expenses.forms import UserRegisterForm

def test_registration():
    print("Testing registration form...")
    
    # Test data
    test_data = {
        'username': 'testuser123',
        'email': 'test@example.com',
        'phone': '1234567890',
        'address': 'Test Address',
        'password1': 'testpass123',
        'password2': 'testpass123'
    }
    
    # Create form
    form = UserRegisterForm(data=test_data)
    
    if form.is_valid():
        print("✓ Form is valid")
        try:
            user = form.save()
            UserProfile.objects.create(user=user)
            print(f"✓ User created successfully: {user.username}")
            print(f"✓ UserProfile created: {user.userprofile}")
            
            # Clean up
            user.delete()
            print("✓ Test user cleaned up")
            return True
        except Exception as e:
            print(f"✗ Error creating user: {e}")
            return False
    else:
        print("✗ Form is invalid:")
        for field, errors in form.errors.items():
            print(f"  {field}: {errors}")
        return False

if __name__ == '__main__':
    test_registration() 