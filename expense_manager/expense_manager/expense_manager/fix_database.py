#!/usr/bin/env python
"""
Script to fix database schema and set up shared categories
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
from django.db import connection
from expenses.models import ExpenseCategory, IncomeCategory

def fix_database_schema():
    """Fix the database schema to match the current models"""
    print("🔧 Fixing database schema...")
    
    with connection.cursor() as cursor:
        # Check if user column exists in expensecategory table
        cursor.execute("PRAGMA table_info(expenses_expensecategory)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'user_id' in columns:
            print("📝 Removing user_id column from expensecategory table...")
            # Create a new table without user_id
            cursor.execute("""
                CREATE TABLE expenses_expensecategory_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(20) UNIQUE NOT NULL,
                    created_at DATETIME NOT NULL
                )
            """)
            
            # Copy data (keeping only unique names)
            cursor.execute("""
                INSERT INTO expenses_expensecategory_new (id, name, created_at)
                SELECT MIN(id), name, MIN(created_at)
                FROM expenses_expensecategory
                GROUP BY name
            """)
            
            # Drop old table and rename new one
            cursor.execute("DROP TABLE expenses_expensecategory")
            cursor.execute("ALTER TABLE expenses_expensecategory_new RENAME TO expenses_expensecategory")
        
        # Check if user column exists in incomecategory table
        cursor.execute("PRAGMA table_info(expenses_incomecategory)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'user_id' in columns:
            print("📝 Removing user_id column from incomecategory table...")
            # Create a new table without user_id
            cursor.execute("""
                CREATE TABLE expenses_incomecategory_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(20) UNIQUE NOT NULL,
                    created_at DATETIME NOT NULL
                )
            """)
            
            # Copy data (keeping only unique names)
            cursor.execute("""
                INSERT INTO expenses_incomecategory_new (id, name, created_at)
                SELECT MIN(id), name, MIN(created_at)
                FROM expenses_incomecategory
                GROUP BY name
            """)
            
            # Drop old table and rename new one
            cursor.execute("DROP TABLE expenses_incomecategory")
            cursor.execute("ALTER TABLE expenses_incomecategory_new RENAME TO expenses_incomecategory")
    
    print("✅ Database schema fixed!")

def setup_categories():
    """Create default categories globally"""
    print("📝 Setting up default categories...")
    
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
    print("🚀 Fixing database and setting up shared categories...")
    
    # Step 1: Fix database schema
    fix_database_schema()
    
    # Step 2: Run migrations to ensure everything is up to date
    print("📦 Running migrations...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations completed successfully!")
    except Exception as e:
        print(f"⚠️ Migration warning: {e}")
    
    # Step 3: Setup categories
    setup_categories()
    
    print("🎉 Setup complete! Categories are now shared across all users.")

if __name__ == '__main__':
    main() 