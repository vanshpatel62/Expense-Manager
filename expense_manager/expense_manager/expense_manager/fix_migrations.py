#!/usr/bin/env python
"""
Script to fix migration issues and set up shared categories
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
from expenses.models import ExpenseCategory, IncomeCategory

def fix_migrations():
    """Run migrations and fix any issues"""
    print("Running migrations...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations completed successfully!")
    except Exception as e:
        print(f"❌ Migration error: {e}")
        return False
    return True

def setup_categories():
    """Create default categories globally"""
    print("Setting up default categories...")
    
    # Default expense categories
    expense_categories = [
        'food', 'transport', 'social_life', 'pets', 
        'apparel', 'health', 'education', 'other'
    ]
    
    # Default income categories
    income_categories = [
        'salary', 'allowance', 'bonus', 'other'
    ]
    
    created_expense = 0
    created_income = 0
    
    # Create expense categories
    for category_name in expense_categories:
        expense_category, created = ExpenseCategory.objects.get_or_create(
            name=category_name
        )
        if created:
            created_expense += 1
    
    # Create income categories
    for category_name in income_categories:
        income_category, created = IncomeCategory.objects.get_or_create(
            name=category_name
        )
        if created:
            created_income += 1
    
    print(f"✅ Successfully created {created_expense} expense categories and {created_income} income categories globally")

def main():
    print("🔧 Fixing migration issues and setting up shared categories...")
    
    # Step 1: Run migrations
    if not fix_migrations():
        print("❌ Failed to run migrations. Please check the error above.")
        return
    
    # Step 2: Setup categories
    setup_categories()
    
    print("🎉 Setup complete! Categories are now shared across all users.")

if __name__ == '__main__':
    main() 