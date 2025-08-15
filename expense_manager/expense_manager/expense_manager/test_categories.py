#!/usr/bin/env python
"""
Script to test the category system and ensure everything is working
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_manager.settings')
django.setup()

from expenses.models import User, ExpenseCategory, IncomeCategory, Account, Transaction, Expense

def test_categories():
    """Test the category system"""
    print("🧪 Testing category system...")
    
    # Check if categories exist
    expense_categories = ExpenseCategory.objects.all()
    income_categories = IncomeCategory.objects.all()
    
    print(f"📊 Found {expense_categories.count()} expense categories:")
    for cat in expense_categories:
        print(f"   - {cat.get_name_display()}")
    
    print(f"📊 Found {income_categories.count()} income categories:")
    for cat in income_categories:
        print(f"   - {cat.get_name_display()}")
    
    # Check if there are any users
    users = User.objects.all()
    print(f"👥 Found {users.count()} users")
    
    # Check if there are any transactions
    transactions = Transaction.objects.all()
    print(f"💰 Found {transactions.count()} transactions")
    
    # Check if there are any expenses
    expenses = Expense.objects.all()
    print(f"💸 Found {expenses.count()} expenses")
    
    # Test if Expense model can use ExpenseCategory
    if expense_categories.exists():
        test_category = expense_categories.first()
        print(f"✅ ExpenseCategory model is working: {test_category}")
    else:
        print("❌ No expense categories found!")
    
    # Show recent transactions with their categories
    if transactions.exists():
        print("\n📋 Recent transactions:")
        for trans in transactions[:3]:
            if trans.transaction_type == 'expense' and trans.expense_category:
                print(f"   - {trans.amount} ({trans.expense_category.get_name_display()})")
            elif trans.transaction_type == 'income' and trans.income_category:
                print(f"   - {trans.amount} ({trans.income_category.get_name_display()})")
    
    print("\n✅ Category system test completed!")

def setup_test_data():
    """Create some test data if needed"""
    print("🔧 Setting up test data...")
    
    # Create default categories if they don't exist
    expense_categories = [
        'food', 'transport', 'social_life', 'pets', 
        'apparel', 'health', 'education', 'other'
    ]
    
    income_categories = [
        'salary', 'allowance', 'bonus', 'other'
    ]
    
    # Create expense categories
    for category_name in expense_categories:
        ExpenseCategory.objects.get_or_create(name=category_name)
    
    # Create income categories
    for category_name in income_categories:
        IncomeCategory.objects.get_or_create(name=category_name)
    
    print("✅ Test data setup completed!")

def main():
    print("🚀 Testing category system...")
    
    # Setup test data
    setup_test_data()
    
    # Test categories
    test_categories()

if __name__ == '__main__':
    main() 