#!/usr/bin/env python
"""
Simple setup script to run migrations and populate categories
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_manager.settings')
django.setup()

from django.core.management import execute_from_command_line

def main():
    print("🚀 Setting up shared categories...")
    
    # Run migrations
    print("📦 Running migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Populate categories
    print("📝 Creating default categories...")
    execute_from_command_line(['manage.py', 'populate_categories'])
    
    print("✅ Setup complete! Categories are now shared across all users.")

if __name__ == '__main__':
    main() 