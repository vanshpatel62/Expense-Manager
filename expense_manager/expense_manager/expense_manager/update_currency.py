#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_manager.settings')
django.setup()

from expenses.models import UserProfile

def update_currency_to_inr():
    """Update all existing user profiles to use INR as default currency"""
    try:
        # Update all UserProfile instances that have USD to INR
        updated_count = UserProfile.objects.filter(currency='USD').update(currency='INR')
        print(f"Updated {updated_count} user profiles from USD to INR")
        
        # Also update any profiles that might have empty currency
        empty_count = UserProfile.objects.filter(currency='').update(currency='INR')
        print(f"Updated {empty_count} user profiles with empty currency to INR")
        
        # Check total profiles
        total_profiles = UserProfile.objects.count()
        inr_profiles = UserProfile.objects.filter(currency='INR').count()
        print(f"Total profiles: {total_profiles}")
        print(f"Profiles with INR: {inr_profiles}")
        
        print("Currency update completed successfully!")
        
    except Exception as e:
        print(f"Error updating currency: {e}")

if __name__ == '__main__':
    update_currency_to_inr() 